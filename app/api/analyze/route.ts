import { analyzeMarketInput } from "@/lib/analyze";
import { AnalyzeInput, Platform, Region } from "@/lib/types";
import { NextResponse } from "next/server";

const ENABLE_LLM =
  process.env.ENABLE_LLM === "true" ||
  Boolean(
    process.env.OPENAI_API_KEY &&
      process.env.OPENAI_BASE_URL &&
      process.env.OPENAI_MODEL
  );
const KEYWORD_MIN_LENGTH = 2;
const KEYWORD_MAX_LENGTH = 80;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 40;

const REGION_OPTIONS: Region[] = ["US", "SEA", "JP"];
const PLATFORM_OPTIONS: Platform[] = ["Amazon", "TikTok"];
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

interface RelayRewriteResult {
  rewritten_keyword: string;
  reason: string;
  confidence: number;
}

const isRegion = (value: string): value is Region =>
  REGION_OPTIONS.includes(value as Region);

const isPlatform = (value: string): value is Platform =>
  PLATFORM_OPTIONS.includes(value as Platform);

class ApiError extends Error {
  status: number;
  code: string;
  retryAfterSeconds?: number;

  constructor(
    status: number,
    code: string,
    message: string,
    retryAfterSeconds?: number
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

const normalizeKeyword = (keyword: string): string => {
  return keyword.trim().replace(/\s+/g, " ");
};

const normalizePlatform = (value: string): Platform | null => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "amazon") {
    return "Amazon";
  }
  if (normalized === "tiktok" || normalized === "tik tok") {
    return "TikTok";
  }
  return null;
};

const cleanupRateLimitStore = (now: number) => {
  if (rateLimitStore.size < 500 || Math.random() > 0.06) {
    return;
  }
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
};

const getClientKey = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "anonymous";
};

const enforceRateLimit = (request: Request) => {
  const now = Date.now();
  cleanupRateLimitStore(now);

  const key = getClientKey(request);
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000)
    );
    throw new ApiError(
      429,
      "rate_limited",
      "Too many requests. Please retry shortly.",
      retryAfterSeconds
    );
  }

  current.count += 1;
  rateLimitStore.set(key, current);
};

const parseJsonBody = async (
  request: Request
): Promise<Record<string, unknown>> => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ApiError(400, "invalid_json", "Request body must be valid JSON.");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ApiError(400, "invalid_payload", "Request body must be a JSON object.");
  }

  return body as Record<string, unknown>;
};

const parseInput = async (request: Request): Promise<AnalyzeInput> => {
  const body = await parseJsonBody(request);
  const rawKeyword = typeof body.keyword === "string" ? body.keyword : "";
  const keyword = normalizeKeyword(rawKeyword);
  const rawRegion = typeof body.region === "string" ? body.region : "";
  const region = rawRegion.trim().toUpperCase();
  const rawPlatform = typeof body.platform === "string" ? body.platform : "";
  const platform = normalizePlatform(rawPlatform);

  if (!keyword || keyword.length < KEYWORD_MIN_LENGTH) {
    throw new ApiError(
      400,
      "keyword_too_short",
      `keyword must be at least ${KEYWORD_MIN_LENGTH} characters`
    );
  }

  if (keyword.length > KEYWORD_MAX_LENGTH) {
    throw new ApiError(
      400,
      "keyword_too_long",
      `keyword must be <= ${KEYWORD_MAX_LENGTH} characters`
    );
  }

  if (!/[a-z0-9]/i.test(keyword)) {
    throw new ApiError(
      400,
      "keyword_invalid",
      "keyword must contain letters or numbers"
    );
  }

  if (!isRegion(region)) {
    throw new ApiError(400, "region_invalid", "region must be one of US, SEA, JP");
  }

  if (!platform || !isPlatform(platform)) {
    throw new ApiError(
      400,
      "platform_invalid",
      "platform must be one of Amazon, TikTok"
    );
  }

  return {
    keyword,
    region,
    platform
  };
};

const extractMessageContent = (content: unknown): string => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const textPart = content.find(
      (part) => part && typeof part === "object" && "text" in part
    );

    if (textPart && typeof textPart.text === "string") {
      return textPart.text;
    }
  }

  return "";
};

const parseRelayRewrite = (rawText: string): RelayRewriteResult | null => {
  try {
    const parsed = JSON.parse(rawText);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const rewrittenKeyword =
      typeof parsed.rewritten_keyword === "string"
        ? normalizeKeyword(parsed.rewritten_keyword)
        : "";

    if (!rewrittenKeyword) {
      return null;
    }

    return {
      rewritten_keyword: rewrittenKeyword,
      reason:
        typeof parsed.reason === "string" && parsed.reason.trim()
          ? parsed.reason.trim()
          : "Rewritten via AI relay.",
      confidence:
        typeof parsed.confidence === "number" && Number.isFinite(parsed.confidence)
          ? Math.max(0, Math.min(1, parsed.confidence))
          : 0.75
    };
  } catch {
    return null;
  }
};

const rewriteKeywordWithRelay = async (
  input: AnalyzeInput
): Promise<RelayRewriteResult | null> => {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !baseUrl || !model) {
    return null;
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            'Rewrite the user input into one clean ecommerce product keyword for routing mock market reports. Return strict JSON only: {"rewritten_keyword":"string","reason":"string","confidence":0.0}'
        },
        {
          role: "user",
          content: `Keyword: ${input.keyword}\nRegion: ${input.region}\nPlatform: ${input.platform}`
        }
      ],
      response_format: { type: "json_object" }
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Relay request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const content = extractMessageContent(payload?.choices?.[0]?.message?.content);
  return parseRelayRewrite(content);
};

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    enforceRateLimit(request);
    const input = await parseInput(request);

    let normalizedInput = input;
    let routedBy: "relay" | "local" = "local";
    let routingReason = "Matched with local benchmark routing.";
    let routingConfidence = 0.68;

    if (ENABLE_LLM) {
      try {
        const relayRewrite = await rewriteKeywordWithRelay(input);
        if (relayRewrite) {
          normalizedInput = {
            ...input,
            keyword: relayRewrite.rewritten_keyword
          };
          routedBy = "relay";
          routingReason = relayRewrite.reason;
          routingConfidence = relayRewrite.confidence;
        }
      } catch (error) {
        console.error("[analyze_route_relay_fallback]", requestId, error);
      }
    }

    const finalReport = analyzeMarketInput(normalizedInput, {
      enableLLM: routedBy === "relay"
    });

    return NextResponse.json(
      {
        ...finalReport,
        routing: {
          matchedBy: routedBy,
          matchedKeyword: normalizedInput.keyword,
          reason: routingReason,
          confidence: routingConfidence
        }
      },
      {
      headers: {
        "x-request-id": requestId
      }
      }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      const errorHeaders: Record<string, string> = {
        "x-request-id": requestId
      };
      if (error.retryAfterSeconds !== undefined) {
        errorHeaders["Retry-After"] = String(error.retryAfterSeconds);
      }

      return NextResponse.json(
        {
          error: error.message,
          error_code: error.code,
          request_id: requestId
        },
        {
          status: error.status,
          headers: errorHeaders
        }
      );
    }

    console.error("[analyze_route_unhandled]", requestId, error);

    return NextResponse.json(
      {
        error: "Failed to generate market report.",
        error_code: "internal_error",
        request_id: requestId
      },
      {
        status: 500,
        headers: {
          "x-request-id": requestId
        }
      }
    );
  }
}

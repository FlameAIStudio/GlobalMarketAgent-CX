import { analyzeMarketInput } from "@/lib/analyze";
import { AnalyzeInput, Platform, Region } from "@/lib/types";
import { NextResponse } from "next/server";

const ENABLE_LLM = process.env.ENABLE_LLM === "true";
const KEYWORD_MIN_LENGTH = 2;
const KEYWORD_MAX_LENGTH = 80;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 40;

const REGION_OPTIONS: Region[] = ["US", "SEA", "JP"];
const PLATFORM_OPTIONS: Platform[] = ["Amazon", "TikTok"];
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

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

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();

  try {
    enforceRateLimit(request);
    const input = await parseInput(request);
    const finalReport = analyzeMarketInput(input, {
      enableLLM: ENABLE_LLM
    });

    return NextResponse.json(finalReport, {
      headers: {
        "x-request-id": requestId
      }
    });
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

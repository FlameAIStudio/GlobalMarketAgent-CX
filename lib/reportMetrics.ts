import { MarketReport } from "@/lib/types";

export type ScoreProfile = "balanced" | "aggressive" | "conservative";

interface ScoreProfileConfig {
  label: string;
  description: string;
  weights: {
    competitor: number;
    price: number;
    customer: number;
    gtm: number;
  };
  thresholds: {
    go: number;
    selective: number;
  };
}

export interface SectionSignal {
  confidence: number;
  evidence: string[];
}

export interface DecisionSignal {
  score: number;
  verdict: "Go" | "Selective Test" | "No-Go";
  confidence: number;
  profile: ScoreProfile;
  profile_label: string;
  rationale: string[];
  evidence: string[];
}

export interface ReportMetrics {
  summary: SectionSignal;
  competitors: SectionSignal;
  price: SectionSignal;
  customer: SectionSignal;
  gtm: SectionSignal;
  decision: DecisionSignal;
}

export const SCORE_PROFILE_CONFIG: Record<ScoreProfile, ScoreProfileConfig> = {
  balanced: {
    label: "Balanced",
    description: "Equal focus on market proof and execution plan.",
    weights: {
      competitor: 0.35,
      price: 0.2,
      customer: 0.2,
      gtm: 0.25
    },
    thresholds: {
      go: 72,
      selective: 56
    }
  },
  aggressive: {
    label: "Aggressive",
    description: "Bias toward fast GTM execution and demand experimentation.",
    weights: {
      competitor: 0.25,
      price: 0.15,
      customer: 0.3,
      gtm: 0.3
    },
    thresholds: {
      go: 66,
      selective: 50
    }
  },
  conservative: {
    label: "Conservative",
    description: "Bias toward stronger market proof before committing resources.",
    weights: {
      competitor: 0.45,
      price: 0.25,
      customer: 0.15,
      gtm: 0.15
    },
    thresholds: {
      go: 78,
      selective: 62
    }
  }
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

const parseNumeric = (value: string): number => {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
};

const parseUpperBound = (range: string): number => {
  const matches = range.match(/\d+/g);
  if (!matches || matches.length === 0) {
    return 0;
  }
  return Number(matches[matches.length - 1]);
};

const formatCount = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const isScoreProfile = (value: string): value is ScoreProfile => {
  return value in SCORE_PROFILE_CONFIG;
};

export const buildReportMetrics = (
  report: MarketReport,
  profile: ScoreProfile = "balanced"
): ReportMetrics => {
  const profileConfig = SCORE_PROFILE_CONFIG[profile];

  const competitorCount = report.competitors.length;
  const totalReviews = report.competitors.reduce((sum, competitor) => {
    return sum + parseNumeric(competitor.reviews);
  }, 0);
  const averageRating =
    competitorCount === 0
      ? 0
      : report.competitors.reduce((sum, competitor) => sum + competitor.rating, 0) /
        competitorCount;

  const competitorConfidence = clamp(
    Math.round(
      (averageRating / 5) * 45 +
        (Math.min(totalReviews, 20000) / 20000) * 35 +
        (Math.min(competitorCount, 5) / 5) * 20
    ),
    35,
    96
  );

  const budgetUpper = parseUpperBound(report.price_analysis.budget);
  const midUpper = parseUpperBound(report.price_analysis.mid);
  const premiumUpper = parseUpperBound(report.price_analysis.premium);
  const monotonicRanges = budgetUpper < midUpper && midUpper < premiumUpper;
  const priceConfidence = clamp(
    48 +
      (monotonicRanges ? 22 : 0) +
      (report.price_analysis.insight.length > 80 ? 16 : 8) +
      (competitorCount >= 3 ? 10 : 4),
    35,
    95
  );

  const insightsCount = report.customer_insights.length;
  const avgInsightLength =
    insightsCount === 0
      ? 0
      : report.customer_insights.reduce((sum, insight) => sum + insight.length, 0) /
        insightsCount;
  const customerConfidence = clamp(
    42 +
      Math.min(insightsCount, 3) * 15 +
      (avgInsightLength > 75 ? 14 : 8) +
      (totalReviews > 4000 ? 10 : 5),
    32,
    94
  );

  const gtmFields = [
    report.gtm.positioning,
    report.gtm.messaging,
    report.gtm.channel_strategy
  ];
  const completeGtmFields = gtmFields.filter((field) => field.trim().length > 0).length;
  const gtmConfidence = clamp(
    40 + completeGtmFields * 16 + (report.gtm.messaging.length > 90 ? 12 : 6) + 8,
    40,
    93
  );

  const summaryConfidence = clamp(
    44 +
      (report.summary.length > 180 ? 16 : 8) +
      (competitorCount >= 3 ? 12 : 4) +
      (insightsCount >= 3 ? 12 : 6) +
      8,
    40,
    92
  );

  const opportunityScore = clamp(
    Math.round(
      competitorConfidence * profileConfig.weights.competitor +
        priceConfidence * profileConfig.weights.price +
        customerConfidence * profileConfig.weights.customer +
        gtmConfidence * profileConfig.weights.gtm
    ),
    0,
    100
  );

  const verdict: DecisionSignal["verdict"] =
    opportunityScore >= profileConfig.thresholds.go
      ? "Go"
      : opportunityScore >= profileConfig.thresholds.selective
      ? "Selective Test"
      : "No-Go";

  const rationale: string[] = [];
  if (competitorConfidence >= 72) {
    rationale.push("Competitive landscape has enough visible signal to benchmark positioning.");
  } else {
    rationale.push("Competitor signal depth is limited, so benchmark confidence is moderate.");
  }
  if (customerConfidence >= 70) {
    rationale.push("Customer pain points are specific enough to support focused messaging tests.");
  } else {
    rationale.push("Customer insight quality is directional and should be validated with live tests.");
  }
  if (gtmConfidence >= 72) {
    rationale.push("GTM structure is actionable with clear positioning, messaging, and channels.");
  } else {
    rationale.push("GTM plan is useful but needs tighter channel economics before scaling.");
  }

  const averageConfidence = Math.round(
    (summaryConfidence +
      competitorConfidence +
      priceConfidence +
      customerConfidence +
      gtmConfidence) /
      5
  );

  return {
    summary: {
      confidence: summaryConfidence,
      evidence: [
        `${competitorCount} competitor references`,
        `${insightsCount} customer insight lines`
      ]
    },
    competitors: {
      confidence: competitorConfidence,
      evidence: [
        `${competitorCount} benchmark products`,
        `${formatCount(totalReviews)} aggregate reviews`,
        `avg rating ${averageRating.toFixed(2)} / 5`
      ]
    },
    price: {
      confidence: priceConfidence,
      evidence: [
        `budget ${report.price_analysis.budget}`,
        `mid ${report.price_analysis.mid}`,
        `premium ${report.price_analysis.premium}`
      ]
    },
    customer: {
      confidence: customerConfidence,
      evidence: [`${insightsCount} qualitative themes`, `${formatCount(totalReviews)} review signals`]
    },
    gtm: {
      confidence: gtmConfidence,
      evidence: [`${completeGtmFields}/3 GTM blocks complete`, `${competitorCount} competitor cues used`]
    },
    decision: {
      score: opportunityScore,
      verdict,
      confidence: averageConfidence,
      profile,
      profile_label: profileConfig.label,
      rationale,
      evidence: [
        `${profileConfig.label} model`,
        `weights C/P/U/G ${Math.round(profileConfig.weights.competitor * 100)}/${Math.round(profileConfig.weights.price * 100)}/${Math.round(profileConfig.weights.customer * 100)}/${Math.round(profileConfig.weights.gtm * 100)}`,
        `competitor confidence ${competitorConfidence}%`,
        `price confidence ${priceConfidence}%`,
        `customer confidence ${customerConfidence}%`,
        `gtm confidence ${gtmConfidence}%`
      ]
    }
  };
};

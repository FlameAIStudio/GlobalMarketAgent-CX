import { AnalyzeInput, DatasetCase, MarketReport } from "@/lib/types";

const FALLBACK_REPORT_TEMPLATE: MarketReport = {
  summary:
    "This category does not map to a prepared benchmark set, so the agent generated a directional strategy view. The opportunity can still be sized quickly using early competitor checks, review mining, and channel-fit tests.",
  competitors: [
    {
      name: "Category Leader A",
      price: "$29.00",
      rating: 4.4,
      reviews: "2,200",
      features: ["Strong value proposition", "Broad review base", "Clear listing copy"]
    },
    {
      name: "Category Leader B",
      price: "$49.00",
      rating: 4.2,
      reviews: "1,150",
      features: ["Premium positioning", "Niche differentiation", "Higher margin band"]
    },
    {
      name: "Rising Challenger C",
      price: "$35.00",
      rating: 4.3,
      reviews: "870",
      features: ["Aggressive offer", "Simple bundle logic", "Fast creative testing"]
    }
  ],
  price_analysis: {
    budget: "$15 - $29",
    mid: "$30 - $59",
    premium: "$60 - $99",
    insight:
      "The mid-range generally offers the strongest conversion-to-margin tradeoff for new entrants."
  },
  customer_insights: [
    "Users care about clear value proof and reliability in real usage scenarios.",
    "Users complain when quality claims are not matched by real product performance.",
    "There is room for a focused offer with sharper positioning and clearer trust signals."
  ],
  gtm: {
    positioning:
      "Position as the credible mid-tier alternative with measurable user outcomes.",
    messaging:
      "Lead with proof: what problem is solved faster or better than current top options.",
    channel_strategy:
      "Start with one primary acquisition channel, validate message-market fit, then scale creatives and bundles."
  }
};

const contextualizeReport = (
  baseReport: MarketReport,
  input: AnalyzeInput,
  sourceCaseLabel?: string
): MarketReport => {
  const report = structuredClone(baseReport);

  if (sourceCaseLabel) {
    report.summary = `Baseline source: ${sourceCaseLabel}. ${report.summary}`;
  }

  report.summary = `${report.summary} Target context: ${input.platform} in ${input.region} for "${input.keyword}".`;

  return report;
};

export const buildReportFromDataset = (
  dataset: DatasetCase,
  input: AnalyzeInput
): MarketReport => {
  const contextMismatch =
    dataset.region !== input.region || dataset.platform !== input.platform;

  if (!contextMismatch) {
    return contextualizeReport(dataset.report, input);
  }

  const sourceLabel = `${dataset.product} (${dataset.platform} ${dataset.region})`;
  return contextualizeReport(dataset.report, input, sourceLabel);
};

export const buildFallbackReport = (input: AnalyzeInput): MarketReport => {
  return contextualizeReport(FALLBACK_REPORT_TEMPLATE, input, "Fallback benchmark");
};

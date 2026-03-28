import { Competitor, MarketReport, PriceAnalysis } from "@/lib/types";

type Currency = "USD" | "JPY";

interface PricePoint {
  currency: Currency;
  value: number;
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const roundDown = (value: number, step: number): number => {
  return Math.floor(value / step) * step;
};

const roundUp = (value: number, step: number): number => {
  return Math.ceil(value / step) * step;
};

const parsePrice = (price: string): PricePoint | null => {
  if (price.includes("$")) {
    const value = Number.parseFloat(price.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(value) && value > 0) {
      return { currency: "USD", value };
    }
  }

  if (/JPY/i.test(price)) {
    const value = Number.parseInt(price.replace(/[^0-9]/g, ""), 10);
    if (Number.isFinite(value) && value > 0) {
      return { currency: "JPY", value };
    }
  }

  return null;
};

const formatMoney = (value: number, currency: Currency): string => {
  if (currency === "JPY") {
    return `JPY ${value.toLocaleString("en-US")}`;
  }

  return `$${value.toLocaleString("en-US")}`;
};

const computeMedian = (sorted: number[]): number => {
  if (sorted.length === 0) {
    return 0;
  }

  const lowerMidIndex = Math.floor((sorted.length - 1) / 2);
  const upperMidIndex = Math.ceil((sorted.length - 1) / 2);
  return (sorted[lowerMidIndex] + sorted[upperMidIndex]) / 2;
};

const pickStep = (currency: Currency, sortedValues: number[]): number => {
  const median = computeMedian(sortedValues);

  if (currency === "JPY") {
    return median < 12000 ? 500 : 1000;
  }

  if (median < 25) {
    return 1;
  }
  if (median < 80) {
    return 5;
  }
  if (median < 220) {
    return 10;
  }
  return 25;
};

const normalizeReviews = (reviews: string): string => {
  const numeric = Number.parseInt(reviews.replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return reviews;
  }

  const clamped = Math.round(clamp(numeric, 500, 200000));
  if (clamped < 2000) {
    return (Math.round(clamped / 10) * 10).toLocaleString("en-US");
  }
  if (clamped < 20000) {
    return (Math.round(clamped / 50) * 50).toLocaleString("en-US");
  }

  return (Math.round(clamped / 100) * 100).toLocaleString("en-US");
};

const normalizeCompetitor = (competitor: Competitor): Competitor => {
  return {
    ...competitor,
    rating: Number(clamp(competitor.rating, 4.0, 4.8).toFixed(1)),
    reviews: normalizeReviews(competitor.reviews)
  };
};

const buildCalibratedPriceAnalysis = (
  values: number[],
  currency: Currency,
  previousInsight: string
): PriceAnalysis => {
  const sorted = [...values].sort((left, right) => left - right);
  const min = sorted[0];
  const lowerMid = sorted[Math.floor((sorted.length - 1) / 2)];
  const upperMid = sorted[Math.ceil((sorted.length - 1) / 2)];
  const max = sorted[sorted.length - 1];
  const step = pickStep(currency, sorted);
  const minimumBandWidth = step * (currency === "JPY" ? 4 : 3);
  const premiumMultiplier = currency === "JPY" ? 1.28 : 1.22;

  const budgetLow = Math.max(step, roundDown(min * 0.72, step));
  let budgetHigh = roundUp((min + lowerMid) / 2, step);
  if (budgetHigh - budgetLow < minimumBandWidth) {
    budgetHigh = budgetLow + minimumBandWidth;
  }

  const midLow = budgetHigh + step;
  let midHigh = roundUp((upperMid + max) / 2, step);
  if (midHigh - midLow < minimumBandWidth) {
    midHigh = midLow + minimumBandWidth;
  }

  const premiumLow = midHigh + step;
  let premiumHigh = roundUp(max * premiumMultiplier, step);
  if (premiumHigh - premiumLow < minimumBandWidth) {
    premiumHigh = premiumLow + minimumBandWidth;
  }

  const calibratedSuffix = " Calibrated to benchmark competitor price points.";
  const insight = previousInsight.includes(calibratedSuffix.trim())
    ? previousInsight
    : `${previousInsight}${calibratedSuffix}`;

  return {
    budget: `${formatMoney(budgetLow, currency)} - ${formatMoney(budgetHigh, currency)}`,
    mid: `${formatMoney(midLow, currency)} - ${formatMoney(midHigh, currency)}`,
    premium: `${formatMoney(premiumLow, currency)} - ${formatMoney(premiumHigh, currency)}`,
    insight
  };
};

export const calibrateMarketReport = (report: MarketReport): MarketReport => {
  const competitors = report.competitors.map(normalizeCompetitor);
  const parsed = competitors
    .map((competitor) => parsePrice(competitor.price))
    .filter((point): point is PricePoint => point !== null);

  if (parsed.length < 3) {
    return {
      ...report,
      competitors
    };
  }

  const currencies = new Set(parsed.map((point) => point.currency));
  if (currencies.size !== 1) {
    return {
      ...report,
      competitors
    };
  }

  const currency = parsed[0].currency;
  const values = parsed.map((point) => point.value);

  return {
    ...report,
    competitors,
    price_analysis: buildCalibratedPriceAnalysis(values, currency, report.price_analysis.insight)
  };
};

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

const normalizeReviews = (reviews: string): string => {
  const numeric = Number.parseInt(reviews.replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return reviews;
  }

  const clamped = Math.round(clamp(numeric, 500, 200000));
  return clamped.toLocaleString("en-US");
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
  const second = sorted[Math.min(1, sorted.length - 1)];
  const third = sorted[Math.min(2, sorted.length - 1)];
  const max = sorted[sorted.length - 1];

  const step = currency === "JPY" ? 500 : 1;
  const premiumMultiplier = currency === "JPY" ? 1.3 : 1.25;

  let budgetLow = roundDown(min * 0.72, step);
  const budgetHigh = roundUp(second, step);

  if (budgetLow >= budgetHigh) {
    budgetLow = Math.max(step, budgetHigh - 6 * step);
  }

  const midLow = budgetHigh + step;
  let midHigh = roundUp(third, step);
  if (midHigh <= midLow) {
    midHigh = midLow + 5 * step;
  }

  const premiumLow = midHigh + step;
  let premiumHigh = roundUp(max * premiumMultiplier, step);
  if (premiumHigh <= premiumLow) {
    premiumHigh = premiumLow + 8 * step;
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

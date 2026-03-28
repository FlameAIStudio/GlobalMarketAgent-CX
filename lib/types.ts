export type Region = "US" | "SEA" | "JP";
export type Platform = "Amazon" | "TikTok";

export interface Competitor {
  name: string;
  price: string;
  rating: number;
  reviews: string;
  features: string[];
}

export interface PriceAnalysis {
  budget: string;
  mid: string;
  premium: string;
  insight: string;
}

export interface GTMStrategy {
  positioning: string;
  messaging: string;
  channel_strategy: string;
}

export interface MarketReport {
  summary: string;
  competitors: Competitor[];
  price_analysis: PriceAnalysis;
  customer_insights: string[];
  gtm: GTMStrategy;
}

export interface DatasetCase {
  id: string;
  keywordTriggers: string[];
  product: string;
  region: Region;
  platform: Platform;
  report: MarketReport;
}

export interface AnalyzeInput {
  keyword: string;
  region: Region;
  platform: Platform;
}

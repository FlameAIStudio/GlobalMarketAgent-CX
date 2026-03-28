import { buildFallbackReport, buildReportFromDataset } from "@/data/reports";
import { matchDatasetByKeyword } from "@/lib/matcher";
import { AnalyzeInput, MarketReport } from "@/lib/types";

export interface AnalyzeOptions {
  enableLLM?: boolean;
}

const refineReportWithLLMStub = (report: MarketReport): MarketReport => {
  const refined = structuredClone(report);
  refined.summary = `${report.summary} Narrative refinement: confidence-adjusted by simulated LLM reasoning.`;
  return refined;
};

export const analyzeMarketInput = (
  input: AnalyzeInput,
  options: AnalyzeOptions = {}
): MarketReport => {
  const matched = matchDatasetByKeyword(input.keyword);
  const baseReport = matched
    ? buildReportFromDataset(matched, input)
    : buildFallbackReport(input);

  if (options.enableLLM) {
    return refineReportWithLLMStub(baseReport);
  }

  return baseReport;
};

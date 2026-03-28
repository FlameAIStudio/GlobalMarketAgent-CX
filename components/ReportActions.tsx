"use client";

import { DecisionSignal } from "@/lib/reportMetrics";
import { MarketReport, Platform, Region } from "@/lib/types";
import { useCallback } from "react";

interface ReportActionsProps {
  keyword: string;
  region: Region;
  platform: Platform;
  report: MarketReport;
  decision: DecisionSignal;
}

const slugify = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
};

export default function ReportActions({
  keyword,
  region,
  platform,
  report,
  decision
}: ReportActionsProps) {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadJson = useCallback(() => {
    const payload = {
      generated_at: new Date().toISOString(),
      context: {
        keyword,
        region,
        platform
      },
      decision,
      report
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `market-report-${slugify(keyword || "analysis")}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [decision, keyword, platform, region, report]);

  return (
    <div className="no-print mb-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className="rounded-lg border border-line bg-panel/70 px-4 py-2 text-sm font-semibold text-text transition hover:border-highlight hover:text-highlight"
      >
        Export PDF
      </button>
      <button
        type="button"
        onClick={handleDownloadJson}
        className="rounded-lg border border-line bg-panel/70 px-4 py-2 text-sm font-semibold text-text transition hover:border-highlight hover:text-highlight"
      >
        Download JSON
      </button>
    </div>
  );
}

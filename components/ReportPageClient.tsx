"use client";

import CompetitorCard from "@/components/CompetitorCard";
import DecisionCard from "@/components/DecisionCard";
import GTMPanel from "@/components/GTMPanel";
import LoadingSteps from "@/components/LoadingSteps";
import PriceChart from "@/components/PriceChart";
import ReportActions from "@/components/ReportActions";
import SectionSignalRow from "@/components/SectionSignalRow";
import { analyzeMarketInput } from "@/lib/analyze";
import {
  SCORE_PROFILE_CONFIG,
  buildReportMetrics,
  isScoreProfile
} from "@/lib/reportMetrics";
import { AnalyzeInput, MarketReport, Platform, Region } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const isRegion = (value: string): value is Region => {
  return ["US", "SEA", "JP"].includes(value);
};

const isPlatform = (value: string): value is Platform => {
  return ["Amazon", "TikTok"].includes(value);
};

const REQUEST_TIMEOUT_MS = 8000;
const STATIC_EXPORT_MODE = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export default function ReportPageClient() {
  const params = useSearchParams();
  const keyword = (params.get("keyword") ?? "").trim();
  const region = (params.get("region") ?? "").trim();
  const platform = (params.get("platform") ?? "").trim();
  const scoreProfileRaw = (params.get("scoreProfile") ?? "").trim().toLowerCase();
  const scoreProfile = isScoreProfile(scoreProfileRaw) ? scoreProfileRaw : "balanced";

  const [report, setReport] = useState<MarketReport | null>(null);
  const [error, setError] = useState<string>("");
  const [stepsDone, setStepsDone] = useState(false);
  const [dataDone, setDataDone] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const handleLoadingComplete = useCallback(() => {
    setStepsDone(true);
  }, []);
  const handleRetry = useCallback(() => {
    setRetryToken((previous) => previous + 1);
  }, []);

  const hasValidInput = keyword.length > 0 && isRegion(region) && isPlatform(platform);
  const metrics = useMemo(() => {
    return report ? buildReportMetrics(report, scoreProfile) : null;
  }, [report, scoreProfile]);

  useEffect(() => {
    if (!hasValidInput) {
      return;
    }

    const parsedInput: AnalyzeInput = {
      keyword,
      region: region as Region,
      platform: platform as Platform
    };

    let requestController: AbortController | null = null;
    let disposed = false;
    let timedOut = false;

    const abortSafely = () => {
      if (!requestController || requestController.signal.aborted) {
        return;
      }
      try {
        requestController.abort();
      } catch {
        // Defensive guard for browser/runtime abort edge cases in dev overlays.
      }
    };

    const timeoutId = setTimeout(() => {
      timedOut = true;
      abortSafely();
    }, REQUEST_TIMEOUT_MS);

    const run = async () => {
      setError("");
      setReport(null);
      setDataDone(false);
      setStepsDone(false);

      try {
        if (STATIC_EXPORT_MODE) {
          await new Promise((resolve) => setTimeout(resolve, 220));
          if (disposed) {
            return;
          }
          const localReport = analyzeMarketInput(parsedInput);
          setReport(localReport);
          return;
        }

        requestController = new AbortController();

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsedInput),
          signal: requestController.signal
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error ?? "Failed to generate report");
        }

        if (disposed) {
          return;
        }

        setReport(payload);
      } catch (caughtError) {
        if (disposed) {
          return;
        }

        if ((caughtError as Error).name === "AbortError" && timedOut) {
          setError(
            `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s. Please retry analysis.`
          );
        } else if ((caughtError as Error).name !== "AbortError") {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unexpected failure while generating report"
          );
        }
      } finally {
        clearTimeout(timeoutId);
        if (!disposed) {
          setDataDone(true);
        }
      }
    };

    run();

    return () => {
      disposed = true;
      clearTimeout(timeoutId);
      if (!STATIC_EXPORT_MODE) {
        abortSafely();
      }
    };
  }, [hasValidInput, keyword, platform, region, retryToken]);

  if (!hasValidInput) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-5 py-12 md:px-8">
        <section className="w-full rounded-2xl border border-line bg-panel/85 p-8 text-center shadow-glow">
          <h1 className="text-2xl font-semibold text-text">Missing Input</h1>
          <p className="mt-3 text-sm text-textdim">
            Please return and submit a valid keyword, region, and platform.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-highlight px-4 py-2 text-sm font-semibold text-base"
          >
            Back to Landing
          </Link>
        </section>
      </main>
    );
  }

  const safeRegion = region as Region;
  const safePlatform = platform as Platform;
  const isLoading = !stepsDone || !dataDone;

  return (
    <main className="report-shell mx-auto min-h-screen w-full max-w-6xl px-5 pb-16 pt-8 md:px-8 md:pt-10">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-textdim">Generated Report</p>
          <h1 className="mt-1 text-2xl font-semibold text-text md:text-3xl">
            {keyword} Market Intelligence
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-line px-3 py-2 text-sm text-textdim transition hover:border-highlight hover:text-text"
        >
          New Analysis
        </Link>
      </div>

      <section className="print-card mb-6 rounded-xl border border-line bg-panel/75 p-4 text-sm text-textdim">
        Context: <span className="text-text">{safeRegion}</span> /{" "}
        <span className="text-text">{safePlatform}</span> /{" "}
        <span className="text-text">{SCORE_PROFILE_CONFIG[scoreProfile].label}</span>
      </section>

      {isLoading && <LoadingSteps onComplete={handleLoadingComplete} />}

      {!isLoading && error && (
        <section className="rounded-xl border border-red-400/50 bg-red-500/10 p-5">
          <p className="text-sm text-red-100">{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 rounded-lg border border-red-300/60 bg-red-300/15 px-3 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-300/25"
          >
            Retry Analysis
          </button>
        </section>
      )}

      {!isLoading && report && metrics && (
        <div className="space-y-6">
          <ReportActions
            keyword={keyword}
            region={safeRegion}
            platform={safePlatform}
            report={report}
            decision={metrics.decision}
          />

          <DecisionCard decision={metrics.decision} />

          <section className="print-card rounded-xl border border-line bg-panel/80 p-5 shadow-glow">
            <h2 className="text-lg font-semibold text-text">Executive Summary</h2>
            <SectionSignalRow
              confidence={metrics.summary.confidence}
              evidence={metrics.summary.evidence}
            />
            <p className="mt-2 text-sm leading-relaxed text-textdim">{report.summary}</p>
          </section>

          <section className="print-card rounded-xl border border-line bg-panel/80 p-5 shadow-glow">
            <h2 className="text-lg font-semibold text-text">Competitor Mapping</h2>
            <SectionSignalRow
              confidence={metrics.competitors.confidence}
              evidence={metrics.competitors.evidence}
            />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {report.competitors.map((competitor) => (
                <CompetitorCard key={competitor.name} competitor={competitor} />
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <PriceChart
              analysis={report.price_analysis}
              confidence={metrics.price.confidence}
              evidence={metrics.price.evidence}
            />

            <section className="print-card rounded-xl border border-line bg-panel/80 p-5 shadow-glow">
              <h3 className="text-lg font-semibold text-text">Customer Insights</h3>
              <SectionSignalRow
                confidence={metrics.customer.confidence}
                evidence={metrics.customer.evidence}
              />
              <ul className="mt-4 space-y-3 text-sm text-textdim">
                {report.customer_insights.map((insight) => (
                  <li key={insight} className="rounded-lg border border-line bg-base/40 p-3">
                    {insight}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <GTMPanel
            gtm={report.gtm}
            confidence={metrics.gtm.confidence}
            evidence={metrics.gtm.evidence}
          />
        </div>
      )}
    </main>
  );
}

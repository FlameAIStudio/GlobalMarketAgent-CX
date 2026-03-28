import { PriceAnalysis } from "@/lib/types";
import SectionSignalRow from "@/components/SectionSignalRow";

interface PriceChartProps {
  analysis: PriceAnalysis;
  confidence?: number;
  evidence?: string[];
}

const parseUpperBound = (value: string): number => {
  const matches = value.match(/\d+/g);

  if (!matches || matches.length === 0) {
    return 0;
  }

  return Number(matches[matches.length - 1]);
};

export default function PriceChart({
  analysis,
  confidence,
  evidence = []
}: PriceChartProps) {
  const bars = [
    { label: "Budget", value: analysis.budget, color: "bg-mint" },
    { label: "Mid", value: analysis.mid, color: "bg-highlight" },
    { label: "Premium", value: analysis.premium, color: "bg-warm" }
  ];

  const maxUpperBound = Math.max(...bars.map((bar) => parseUpperBound(bar.value)), 1);

  return (
    <section className="print-card rounded-xl border border-line bg-panel/80 p-5 shadow-glow">
      <h3 className="text-lg font-semibold text-text">Price Analysis</h3>
      {typeof confidence === "number" && evidence.length > 0 && (
        <SectionSignalRow confidence={confidence} evidence={evidence} />
      )}
      <p className="mt-2 text-sm text-textdim">{analysis.insight}</p>

      <div className="mt-5 space-y-4">
        {bars.map((bar) => {
          const upperBound = parseUpperBound(bar.value);
          const width = Math.max(Math.round((upperBound / maxUpperBound) * 100), 8);

          return (
            <div key={bar.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-textdim">
                <span>{bar.label}</span>
                <span>{bar.value}</span>
              </div>
              <div className="h-3 rounded-full bg-base">
                <div
                  className={`h-full rounded-full ${bar.color} animate-pulseLine origin-left`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

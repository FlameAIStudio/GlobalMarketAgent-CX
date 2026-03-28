import { DecisionSignal } from "@/lib/reportMetrics";

interface DecisionCardProps {
  decision: DecisionSignal;
}

const verdictStyleMap: Record<DecisionSignal["verdict"], string> = {
  Go: "border-mint/50 bg-mint/10 text-mint",
  "Selective Test": "border-warm/50 bg-warm/10 text-warm",
  "No-Go": "border-red-400/50 bg-red-500/10 text-red-200"
};

export default function DecisionCard({ decision }: DecisionCardProps) {
  return (
    <section className="print-card rounded-xl border border-line bg-panel/80 p-5 shadow-glow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-textdim">Decision Snapshot</p>
          <h2 className="mt-1 text-xl font-semibold text-text">Go / No-Go Signal</h2>
          <p className="mt-2 text-xs text-textdim">Scoring model: {decision.profile_label}</p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${verdictStyleMap[decision.verdict]}`}
        >
          {decision.verdict}
        </span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.5fr]">
        <div className="rounded-lg border border-line bg-base/55 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-textdim">Opportunity Score</p>
          <p className="mt-1 text-4xl font-semibold text-text">{decision.score}</p>
          <p className="mt-1 text-xs text-textdim">Confidence {decision.confidence}%</p>
        </div>

        <div className="space-y-2">
          {decision.rationale.map((line) => (
            <p key={line} className="rounded-lg border border-line bg-base/35 px-3 py-2 text-sm text-textdim">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {decision.evidence.map((item) => (
          <span
            key={item}
            className="rounded-full border border-line px-2.5 py-1 text-xs text-textdim"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

import { GTMStrategy } from "@/lib/types";
import SectionSignalRow from "@/components/SectionSignalRow";

interface GTMPanelProps {
  gtm: GTMStrategy;
  confidence?: number;
  evidence?: string[];
}

export default function GTMPanel({
  gtm,
  confidence,
  evidence = []
}: GTMPanelProps) {
  return (
    <section className="print-card rounded-xl border border-line bg-panel/80 p-5 shadow-glow">
      <h3 className="text-lg font-semibold text-text">GTM Strategy</h3>
      {typeof confidence === "number" && evidence.length > 0 && (
        <SectionSignalRow confidence={confidence} evidence={evidence} />
      )}
      <div className="mt-4 space-y-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-textdim">Positioning</p>
          <p className="mt-1 text-text">{gtm.positioning}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-textdim">Messaging</p>
          <p className="mt-1 text-text">{gtm.messaging}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-textdim">Channel Strategy</p>
          <p className="mt-1 text-text">{gtm.channel_strategy}</p>
        </div>
      </div>
    </section>
  );
}

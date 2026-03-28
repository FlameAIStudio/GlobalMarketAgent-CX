interface SectionSignalRowProps {
  confidence: number;
  evidence: string[];
}

export default function SectionSignalRow({
  confidence,
  evidence
}: SectionSignalRowProps) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="rounded-full border border-highlight/40 bg-highlight/10 px-2.5 py-1 text-xs text-highlight">
        Confidence {confidence}%
      </span>
      {evidence.map((item) => (
        <span
          key={item}
          className="rounded-full border border-line px-2.5 py-1 text-xs text-textdim"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

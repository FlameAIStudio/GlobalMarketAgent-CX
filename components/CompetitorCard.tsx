import { Competitor } from "@/lib/types";

interface CompetitorCardProps {
  competitor: Competitor;
}

export default function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <article className="print-card rounded-xl border border-line bg-panel/80 p-4 shadow-glow">
      <header className="flex items-start justify-between gap-3">
        <h4 className="text-base font-semibold text-text">{competitor.name}</h4>
        <span className="rounded-full border border-highlight/40 px-2 py-0.5 text-xs text-highlight">
          {competitor.price}
        </span>
      </header>

      <div className="mt-3 flex gap-2 text-xs text-textdim">
        <span>Rating: {competitor.rating.toFixed(1)}</span>
        <span className="text-line">|</span>
        <span>{competitor.reviews} reviews</span>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {competitor.features.map((feature) => (
          <li
            key={feature}
            className="rounded-full border border-line px-2 py-1 text-xs text-textdim"
          >
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}

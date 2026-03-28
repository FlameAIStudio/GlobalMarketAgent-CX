"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

type Region = "US" | "SEA" | "JP";
type Platform = "Amazon" | "TikTok";
type ScoreProfile = "balanced" | "aggressive" | "conservative";

interface DemoCase {
  label: string;
  keyword: string;
  region: Region;
  platform: Platform;
}

const DEMO_CASES: DemoCase[] = [
  {
    label: "Main Demo",
    keyword: "wireless earbuds",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "Backup Demo",
    keyword: "pet grooming brush",
    region: "SEA",
    platform: "TikTok"
  },
  {
    label: "Alt Demo",
    keyword: "yoga mat",
    region: "US",
    platform: "Amazon"
  }
];

export default function InputForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [keyword, setKeyword] = useState("wireless earbuds");
  const [region, setRegion] = useState<Region>("US");
  const [platform, setPlatform] = useState<Platform>("Amazon");
  const [scoreProfile, setScoreProfile] = useState<ScoreProfile>("balanced");

  const applyDemoCase = (demoCase: DemoCase) => {
    setKeyword(demoCase.keyword);
    setRegion(demoCase.region);
    setPlatform(demoCase.platform);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const search = new URLSearchParams({
      keyword: keyword.trim(),
      region,
      platform,
      scoreProfile
    });

    startTransition(() => {
      router.push(`/report?${search.toString()}`);
    });
  };

  return (
    <section className="rounded-2xl border border-line/80 bg-panel/85 p-6 shadow-glow backdrop-blur-sm md:p-8">
      <h2 className="text-lg font-semibold text-text md:text-xl">Start Market Analysis</h2>
      <p className="mt-2 max-w-2xl text-sm text-textdim">
        Input one product idea and generate a structured GTM report in seconds.
      </p>

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm text-textdim">Product keyword</span>
          <input
            className="w-full rounded-xl border border-line bg-base/80 px-4 py-3 text-text outline-none transition focus:border-highlight"
            placeholder="e.g. wireless earbuds"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            required
          />
        </label>

        <label>
          <span className="mb-2 block text-sm text-textdim">Target region</span>
          <select
            className="w-full rounded-xl border border-line bg-base/80 px-4 py-3 text-text outline-none transition focus:border-highlight"
            value={region}
            onChange={(event) => setRegion(event.target.value as Region)}
          >
            <option value="US">US</option>
            <option value="SEA">SEA</option>
            <option value="JP">JP</option>
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm text-textdim">Platform</span>
          <select
            className="w-full rounded-xl border border-line bg-base/80 px-4 py-3 text-text outline-none transition focus:border-highlight"
            value={platform}
            onChange={(event) => setPlatform(event.target.value as Platform)}
          >
            <option value="Amazon">Amazon</option>
            <option value="TikTok">TikTok</option>
          </select>
        </label>

        <label className="md:col-span-2">
          <span className="mb-2 block text-sm text-textdim">Scoring model</span>
          <select
            className="w-full rounded-xl border border-line bg-base/80 px-4 py-3 text-text outline-none transition focus:border-highlight"
            value={scoreProfile}
            onChange={(event) => setScoreProfile(event.target.value as ScoreProfile)}
          >
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
            <option value="conservative">Conservative</option>
          </select>
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-2">
          {DEMO_CASES.map((demoCase) => (
            <button
              key={demoCase.label}
              type="button"
              className="rounded-full border border-line px-3 py-1.5 text-xs text-textdim transition hover:border-highlight hover:text-text"
              onClick={() => applyDemoCase(demoCase)}
            >
              {demoCase.label}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="md:col-span-2 rounded-xl bg-highlight px-4 py-3 text-sm font-semibold text-base transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Generating..." : "Generate Report"}
        </button>
      </form>
    </section>
  );
}

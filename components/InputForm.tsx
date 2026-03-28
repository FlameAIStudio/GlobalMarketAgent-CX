"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

type Region = "US" | "SEA" | "JP";
type Platform = "Amazon" | "TikTok";
type ScoreProfile = "balanced" | "aggressive" | "conservative";

interface DemoCase {
  label: string;
  category: string;
  keyword: string;
  region: Region;
  platform: Platform;
}

const DEMO_CASES: DemoCase[] = [
  {
    label: "Wireless Earbuds",
    category: "Electronics",
    keyword: "wireless earbuds",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "Air Fryer",
    category: "Home & Kitchen",
    keyword: "air fryer",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "Robot Vacuum",
    category: "Home Appliances",
    keyword: "robot vacuum",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "Standing Desk",
    category: "Office",
    keyword: "standing desk",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "Dash Cam",
    category: "Automotive",
    keyword: "dash cam",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "Water Flosser",
    category: "Personal Care",
    keyword: "water flosser",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "Memory Foam Pillow",
    category: "Home & Bedding",
    keyword: "memory foam pillow",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "Cast Iron Skillet",
    category: "Cookware",
    keyword: "cast iron skillet",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "Resistance Bands",
    category: "Sports & Fitness",
    keyword: "resistance bands",
    region: "US",
    platform: "Amazon"
  },
  {
    label: "LED Strip Lights",
    category: "Home Improvement",
    keyword: "led strip lights",
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

  const normalizedKeyword = keyword.trim().toLowerCase();

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
        Input one product idea or a natural-language product brief and generate a structured GTM report in seconds.
      </p>

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="md:col-span-2">
          <span className="mb-2 block text-sm text-textdim">Product description</span>
          <input
            className="w-full rounded-xl border border-line bg-base/80 px-4 py-3 text-text outline-none transition focus:border-highlight"
            placeholder="e.g. affordable sports earbuds with ANC for Amazon US"
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

        <div className="md:col-span-2">
          <p className="mb-2 text-xs uppercase tracking-[0.15em] text-textdim">
            Amazon Top 10 Presets
          </p>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {DEMO_CASES.map((demoCase) => {
              const isActive =
                normalizedKeyword === demoCase.keyword &&
                region === demoCase.region &&
                platform === demoCase.platform;

              return (
                <button
                  key={demoCase.label}
                  type="button"
                  className={`rounded-xl border px-3 py-2 text-left transition ${
                    isActive
                      ? "border-highlight bg-highlight/10 text-text"
                      : "border-line/90 bg-base/40 text-textdim hover:border-highlight hover:text-text"
                  }`}
                  onClick={() => applyDemoCase(demoCase)}
                >
                  <span className="block text-sm font-medium">{demoCase.label}</span>
                  <span className="mt-1 block text-xs text-textdim">
                    {demoCase.category} · {demoCase.keyword}
                  </span>
                </button>
              );
            })}
          </div>
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

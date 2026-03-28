"use client";

import { useEffect, useMemo, useState } from "react";

const STEP_LABELS = [
  "Planner defining research scope...",
  "Browser collecting competitor signals...",
  "Analyst synthesizing market patterns...",
  "Architect generating GTM strategy..."
];

const randomStepDuration = () => {
  return 800 + Math.floor(Math.random() * 401);
};

interface LoadingStepsProps {
  onComplete: () => void;
}

export default function LoadingSteps({ onComplete }: LoadingStepsProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(
    STEP_LABELS.map(() => false)
  );

  const totalSteps = STEP_LABELS.length;

  const progress = useMemo(() => {
    const doneCount = completed.filter(Boolean).length;
    return Math.round((doneCount / totalSteps) * 100);
  }, [completed, totalSteps]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const walk = (index: number) => {
      if (index >= totalSteps) {
        onComplete();
        return;
      }

      setActiveStep(index);
      timeoutId = setTimeout(() => {
        setCompleted((previous) => {
          const next = [...previous];
          next[index] = true;
          return next;
        });
        walk(index + 1);
      }, randomStepDuration());
    };

    walk(0);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [onComplete, totalSteps]);

  return (
    <div className="rounded-2xl border border-line bg-panel/90 p-6 shadow-glow md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-textdim">Agent Runtime</p>
      <h2 className="mt-2 text-xl font-semibold text-text md:text-2xl">
        Generating Intelligence Report
      </h2>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-base">
        <div
          className="h-full rounded-full bg-gradient-to-r from-highlight to-mint transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-textdim">{progress}% complete</p>

      <ul className="mt-6 space-y-3">
        {STEP_LABELS.map((label, index) => {
          const isDone = completed[index];
          const isActive = activeStep === index && !isDone;

          return (
            <li
              key={label}
              className={`rounded-xl border px-4 py-3 text-sm transition ${
                isDone
                  ? "border-mint/40 bg-mint/10 text-text"
                  : isActive
                  ? "border-highlight/50 bg-highlight/10 text-text animate-riseIn"
                  : "border-line bg-base/30 text-textdim"
              }`}
            >
              {label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

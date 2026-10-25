"use client";
import { useEffect, useState } from "react";

const STEPS = ["Reading your resume", "Identifying transferable skills", "Mapping your target role", "Finding your skill gaps", "Building your learning path"];

export default function Loading() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, STEPS.length - 1)), 900);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="pop pt-10" aria-live="polite">
      <h1 className="text-3xl font-bold tracking-tight">Analysing your profile</h1>
      <ul className="mt-8 space-y-4">
        {STEPS.map((s, n) => (
          <li key={s} className={`flex items-center gap-3 text-lg transition-opacity ${n > i ? "opacity-25" : "opacity-100"}`}>
            <span className={`grid h-7 w-7 place-items-center rounded-full text-sm ${n < i ? "bg-beep text-white" : n === i ? "border-2 border-beep" : "border border-ink/20"}`}>
              {n < i ? "✓" : n === i ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-beep" /> : null}
            </span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

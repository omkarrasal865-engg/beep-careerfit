"use client";
import { useRef, useState } from "react";
import { GOALS, ROLES } from "@/lib/types";

export default function Form({ onSubmit, error }: { onSubmit: (d: FormData) => void; error: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const ready = !!file && !!role && !!goal;

  function go(sample: boolean, r = role, g = goal) {
    const d = new FormData();
    d.set("role", r); d.set("goal", g);
    if (sample) d.set("sample", "1"); else if (file) d.set("resume", file);
    onSubmit(d);
  }

  return (
    <div className="pop">
      <h1 className="text-4xl font-bold leading-tight tracking-tight">Build your career path</h1>
      <p className="mt-3 text-lg text-ink/70">Tell us where you want to go. We&apos;ll tell you what to learn next.</p>

      <div className="mt-8 space-y-6">
        <section>
          <h2 className="mb-2 text-sm font-semibold">1. Your resume</h2>
          <button type="button" onClick={() => input.current?.click()}
            className={`flex w-full items-center justify-between rounded-2xl border-2 border-dashed px-4 py-5 text-left transition ${file ? "border-beep bg-beep-soft" : "border-ink/20 bg-white hover:border-beep"}`}>
            <span className="min-w-0">
              <span className="block truncate font-medium">{file ? file.name : "Upload your resume"}</span>
              <span className="text-sm text-ink/60">{file ? "Tap to change" : "PDF, up to 5 MB"}</span>
            </span>
            <span className="ml-3 shrink-0 rounded-full bg-ink px-3 py-1 text-sm text-white">{file ? "Change" : "Browse"}</span>
          </button>
          <input ref={input} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </section>

        <section>
          <label htmlFor="role" className="mb-2 block text-sm font-semibold">2. Target role</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-base">
            <option value="">Choose a career</option>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold">3. Your priority</h2>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {GOALS.map((g) => (
              <button key={g} type="button" role="radio" aria-checked={goal === g} onClick={() => setGoal(g)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${goal === g ? "border-beep bg-beep text-white" : "border-ink/15 bg-white hover:border-beep"}`}>
                {g}
              </button>
            ))}
          </div>
        </section>

        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="space-y-3 pt-2">
          <button type="button" disabled={!ready} onClick={() => go(false)}
            className="w-full rounded-full bg-beep py-4 text-base font-semibold text-white transition enabled:hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40">
            Find my learning path
          </button>
          <button type="button" onClick={() => go(true, role || "Product Management", goal || "Get job-ready")}
            className="w-full rounded-full border border-ink/20 py-3.5 text-base font-medium hover:border-beep hover:text-beep">
            Try with sample resume
          </button>
        </div>
      </div>
    </div>
  );
}

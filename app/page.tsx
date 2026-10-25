"use client";
import { useState } from "react";
import Form from "@/components/Form";
import Loading from "@/components/Loading";
import Results from "@/components/Results";
import type { Result } from "@/lib/types";

export default function Home() {
  const [step, setStep] = useState<"form" | "loading" | "results">("form");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function submit(data: FormData) {
    setError("");
    setStep("loading");
    const minWait = new Promise((r) => setTimeout(r, 4600)); // let the analysis animation finish
    try {
      const [res] = await Promise.all([fetch("/api/analyze", { method: "POST", body: data }), minWait]);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setResult(json);
      setStep("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStep("form");
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-5 pb-16 pt-6">
      <header className="mb-8 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-beep text-sm font-bold text-white">b</span>
        <span className="font-semibold">Beep CareerFit</span>
      </header>
      {step === "form" && <Form onSubmit={submit} error={error} />}
      {step === "loading" && <Loading />}
      {step === "results" && result && <Results result={result} onReset={() => setStep("form")} />}
    </main>
  );
}

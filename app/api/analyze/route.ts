import { NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";
import { aiAnalyze } from "@/lib/ai";
import { courses, demoAnalyze } from "@/lib/demo";
import { GOALS, ROLES, SAMPLE_RESUME, type Result } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const role = String(form.get("role") ?? "");
    const goal = String(form.get("goal") ?? "");
    if (!ROLES.includes(role) || !GOALS.includes(goal)) return NextResponse.json({ error: "Pick a target role and a priority." }, { status: 400 });

    let resume = SAMPLE_RESUME;
    const file = form.get("resume");
    if (form.get("sample") !== "1") {
      if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "Upload a PDF resume or try the sample." }, { status: 400 });
      if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "PDF is too large. Keep it under 5 MB." }, { status: 400 });
      try {
        const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
        resume = (await extractText(pdf, { mergePages: true })).text;
      } catch {
        return NextResponse.json({ error: "We couldn't read that PDF. Try another file or the sample resume." }, { status: 422 });
      }
      if (resume.trim().length < 80) return NextResponse.json({ error: "No readable text found (scanned PDF?). Try a text-based PDF or the sample resume." }, { status: 422 });
    }

    let analysis, mode: Result["mode"] = "ai", note: string | undefined;
    const useAI = process.env.ANTHROPIC_API_KEY && process.env.DEMO_MODE !== "true";
    if (useAI) {
      try { analysis = await aiAnalyze(resume, role, goal); }
      catch (e) { console.error("AI failed, using demo mode:", e); }
    }
    if (!analysis) {
      mode = "demo";
      note = useAI ? "AI was unavailable, so this plan uses our offline matcher." : "Demo mode: add an API key for AI analysis.";
      analysis = demoAnalyze(resume, role, goal);
    }
    const recommendations = analysis.recommendations.map((r) => ({ ...r, course: courses.find((c) => c.id === r.courseId) }));
    return NextResponse.json({ ...analysis, recommendations, role, goal, mode, note } satisfies Result);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

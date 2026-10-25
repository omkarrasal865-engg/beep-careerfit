import { courses } from "./demo";
import type { Analysis, Priority } from "./types";

const catalog = courses.map((c) => ({ id: c.id, title: c.title, domain: c.domain, level: c.level, duration: c.duration, skills: c.skills }));

export async function aiAnalyze(resume: string, role: string, goal: string): Promise<Analysis> {
  const key = process.env.ANTHROPIC_API_KEY!;
  const prompt = `You are a career advisor for students. Analyze the resume for the target role and recommend courses ONLY from the catalog.

Target role: ${role}
Student priority: ${goal}

Resume:
"""
${resume.slice(0, 8000)}
"""

Course catalog (JSON):
${JSON.stringify(catalog)}

Rules:
- Recommend 3 to 5 courses. courseId MUST be an id from the catalog. Never invent courses.
- Order recommendations as the learning path (what to do first comes first).
- priority is "High", "Medium" or "Low".
- reason: one short sentence (max 25 words) linking the student's background to the course.
- skillsAddressed: skills from the course that fill the student's gaps.
- currentSkills: 3-6 transferable skills evidenced in the resume. skillGaps: 3-6 skills missing for the role.
- profileSummary: max 2 short sentences.
Respond with ONLY valid JSON, no markdown:
{"profileSummary":"","currentSkills":[],"skillGaps":[],"recommendations":[{"courseId":"","reason":"","priority":"High","skillsAddressed":[]}]}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
    signal: AbortSignal.timeout(45000),
  });
  if (!res.ok) throw new Error(`AI API ${res.status}`);
  const data = await res.json();
  const raw: string = data.content?.map((b: { text?: string }) => b.text ?? "").join("") ?? "";
  const parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));

  const ids = new Set(courses.map((c) => c.id));
  const seen = new Set<string>();
  const recommendations = (parsed.recommendations ?? [])
    .filter((r: { courseId: string }) => ids.has(r.courseId) && !seen.has(r.courseId) && seen.add(r.courseId))
    .slice(0, 5)
    .map((r: { courseId: string; reason?: string; priority?: string; skillsAddressed?: string[] }) => ({
      courseId: r.courseId,
      reason: String(r.reason ?? ""),
      priority: (["High", "Medium", "Low"].includes(r.priority ?? "") ? r.priority : "Medium") as Priority,
      skillsAddressed: Array.isArray(r.skillsAddressed) ? r.skillsAddressed.map(String) : [],
    }));
  if (!recommendations.length) throw new Error("No valid recommendations");
  const list = (v: unknown) => (Array.isArray(v) ? v.map(String).slice(0, 6) : []);
  return { profileSummary: String(parsed.profileSummary ?? ""), currentSkills: list(parsed.currentSkills), skillGaps: list(parsed.skillGaps), recommendations };
}

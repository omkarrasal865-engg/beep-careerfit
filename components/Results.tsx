import type { Rec, Result } from "@/lib/types";

const PRIORITY_STYLE = { High: "bg-ink text-white", Medium: "bg-beep-soft text-beep", Low: "bg-ink/5 text-ink/70" };

function Chips({ items, tone }: { items: string[]; tone: "green" | "blue" | "plain" }) {
  const cls = tone === "green" ? "bg-emerald-100 text-emerald-900" : tone === "blue" ? "bg-beep-soft text-beep" : "bg-ink/5 text-ink/80";
  return <div className="flex flex-wrap gap-2">{items.map((s) => <span key={s} className={`rounded-full px-3 py-1 text-sm font-medium ${cls}`}>{s}</span>)}</div>;
}

function CourseCard({ r }: { r: Rec }) {
  const c = r.course;
  if (!c) return null;
  return (
    <article className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className={`rounded-full px-2.5 py-1 ${PRIORITY_STYLE[r.priority]}`}>{r.priority} priority</span>
        <span className="rounded-full bg-ink/5 px-2.5 py-1">{c.level}</span>
        <span className="rounded-full bg-ink/5 px-2.5 py-1">{c.duration}</span>
      </div>
      <h3 className="text-lg font-bold leading-snug">{c.title}</h3>
      <p className="mt-2 text-[15px] text-ink/75"><span className="font-semibold text-ink">Why this: </span>{r.reason}</p>
      <div className="mt-3"><p className="mb-1.5 text-sm font-semibold">Skills you&apos;ll gain</p><Chips items={r.skillsAddressed.length ? r.skillsAddressed : c.skills} tone="blue" /></div>
      <a href={c.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-full bg-beep px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink">View course</a>
      <p className="mt-2 text-xs text-ink/45">Demo link, not a live Beep course page.</p>
    </article>
  );
}

export default function Results({ result, onReset }: { result: Result; onReset: () => void }) {
  const recs = result.recommendations;
  return (
    <div className="pop space-y-8">
      <div>
        <p className="text-sm text-ink/60">Your path to</p>
        <h1 className="text-3xl font-bold tracking-tight">{result.role}</h1>
        <p className="mt-3 text-[17px] text-ink/80">{result.profileSummary}</p>
        {result.mode === "demo" && <p className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">{result.note}</p>}
      </div>

      <section><h2 className="mb-3 text-lg font-bold">You&apos;re already strong in</h2><Chips items={result.currentSkills} tone="green" /></section>
      <section><h2 className="mb-3 text-lg font-bold">Skills to build</h2><Chips items={result.skillGaps} tone="blue" /></section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Your learning path</h2>
        <ol className="space-y-0">
          {recs.map((r, i) => (
            <li key={r.courseId} className="relative flex gap-4 pb-5 last:pb-0">
              {i < recs.length - 1 && <span className="absolute left-[13px] top-7 h-full w-px bg-ink/15" />}
              <span className="z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-beep text-sm font-bold text-white">{i + 1}</span>
              <div><p className="font-semibold leading-snug">{r.course?.title}</p><p className="text-sm text-ink/60">{r.course?.duration} · {r.course?.level}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Recommended courses</h2>
        {recs.map((r) => <CourseCard key={r.courseId} r={r} />)}
      </section>

      <section className="rounded-2xl bg-beep-soft p-5">
        <h2 className="mb-2 text-lg font-bold">How we chose these</h2>
        <p className="text-[15px] text-ink/80">
          We compared what your resume shows{result.currentSkills.length ? ` (${result.currentSkills.slice(0, 3).join(", ")})` : ""} with the skills {result.role} roles ask for.
          Courses that close your biggest gaps, such as {result.skillGaps.slice(0, 2).join(" and ") || "core skills"}, come first. Because you chose &ldquo;{result.goal}&rdquo;, we ordered them to match that goal.
          Every course comes from the Beep catalog.
        </p>
      </section>

      <button onClick={onReset} className="w-full rounded-full border border-ink/20 py-3.5 font-medium hover:border-beep hover:text-beep">Start over</button>
    </div>
  );
}

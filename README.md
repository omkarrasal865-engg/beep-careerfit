# Beep CareerFit

*Know what to learn next, not everything you could learn.*

Upload a resume (PDF), pick a target career and a priority, and get transferable skills, skill gaps and a prioritized learning path built only from a local course database (`data/courses.json`, 25 demo courses).

## Run locally

Requires Node 18.18+.

```bash
npm install
cp .env.example .env.local   # optional: add ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## AI vs demo mode

- With `ANTHROPIC_API_KEY` set in `.env.local`, the server route (`app/api/analyze/route.ts`) sends the extracted resume text, role, priority and course catalog to the Anthropic API and asks for structured JSON. Returned course IDs are validated against `courses.json`; invented IDs are dropped.
- Without a key (or with `DEMO_MODE=true`, or if the AI call fails), a deterministic keyword matcher (`lib/demo.ts`) produces the full experience, so the app always works.
- The key is read only on the server and never reaches the browser.

Use **Try with sample resume** to test without a file.

## Structure

```
app/page.tsx              multi-step flow (form → analysis → results)
app/api/analyze/route.ts  PDF text extraction (unpdf) + AI/demo analysis
lib/ai.ts, lib/demo.ts    AI call + validation, deterministic fallback
data/courses.json         course database (demo URLs, not real Beep pages)
components/               Form, Loading, Results
```

## Notes

- Course URLs are `example.com/beep-demo/...` placeholders. Replace them with real URLs when available.
- Scanned (image-only) PDFs have no text layer and will show a friendly error; OCR is out of scope for this MVP.

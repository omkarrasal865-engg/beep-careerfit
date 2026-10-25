import coursesJson from "@/data/courses.json";
import type { Analysis, Course, Priority } from "./types";

export const courses = coursesJson as Course[];

/* ------------------------------------------------------------------ *
 * Deterministic, resume-aware analysis (no API calls).
 * 1) extract signals from resume text  2) score the resume against a
 * role skill map  3) rank catalog courses by the gaps they close.
 * ------------------------------------------------------------------ */

type Tier = "core" | "important" | "nice";
type Skill = { name: string; tier: Tier; strong: string[]; weak: string[] };
const W: Record<Tier, number> = { core: 3, important: 2, nice: 1 };
const LEVEL = { Beginner: 0, Intermediate: 1, Advanced: 2 };
// strong keywords = one hit is enough; weak keywords = need two hits
const sk = (name: string, tier: Tier, strong: string[], weak: string[] = []): Skill => ({ name, tier, strong, weak });

const STAKEHOLDER = sk("Stakeholder Management", "important", ["stakeholder", "cross-functional", "founder's office", "sponsor", "vendor", "client"], ["coordinated with", "presented to", "liaised"]);
const EXCEL = (tier: Tier) => sk("Advanced Excel", tier, ["vlookup", "xlookup", "pivot", "macro", "power query", "advanced excel"], ["excel", "spreadsheet"]);
const AB = sk("A/B Testing", "nice", ["a/b test", "ab test", "split test", "experiment"]);
const DATAVIZ = (tier: Tier) => sk("Data Visualization", tier, ["tableau", "visualization", "visualisation", "looker", "matplotlib", "power bi"], ["dashboard", "charts"]);

const ROLE_SKILLS: Record<string, Skill[]> = {
  "Product Management": [
    sk("Product Thinking", "core", ["product thinking", "product sense", "product design", "product development", "product owner", "product manager", "user problem", "mvp", "prototype", "wireframe", "design thinking"]),
    sk("User Research", "core", ["user research", "customer interview", "user interview", "usability", "customer discovery", "persona", "focus group", "survey", "customer feedback"]),
    sk("Prioritization Frameworks", "core", ["rice", "moscow", "prioritization", "prioritisation", "prioritized", "prioritised", "backlog"]),
    sk("Roadmapping", "important", ["roadmap", "release plan"]),
    sk("Product Strategy", "important", ["product strategy", "go-to-market", "gtm", "market research", "competitive analysis", "competitor analysis", "business strategy", "positioning"]),
    sk("Product Metrics", "important", ["product metric", "kpi", "okr", "funnel", "retention", "conversion", "north star", "cohort"]),
    STAKEHOLDER, AB,
    sk("SQL", "nice", ["sql", "mysql", "postgres", "bigquery"]),
  ],
  "Project Management": [
    sk("Project Planning", "core", ["project plan", "project management", "project coordination", "gantt", "timeline", "deliverable", "schedule", "milestone", "managed a team", "event management"], ["planned", "organized", "organised", "coordinated"]),
    sk("Scope Management", "important", ["scope", "project charter", "change request", "requirements"]),
    sk("Risk Management", "core", ["risk", "mitigation", "contingency", "compliance"]),
    sk("Agile", "core", ["agile", "kanban", "jira"]),
    sk("Scrum", "important", ["scrum", "stand-up", "standup", "retrospective"]),
    sk("Sprint Planning", "nice", ["sprint", "velocity", "story points", "backlog"]),
    sk("Budgeting", "important", ["budget", "cost control", "expense", "funds"]),
    sk("PMP Certification", "nice", ["pmp", "prince2", "capm", "certified project"]),
    STAKEHOLDER,
  ],
  "Business Analytics": [
    sk("Requirements Gathering", "core", ["requirement", "user stories", "brd", "frd", "use case", "functional specification", "stakeholder interview"]),
    sk("Business Analysis", "core", ["business analysis", "business analyst", "gap analysis", "swot", "feasibility", "process improvement", "cost-benefit"]),
    sk("Process Mapping", "important", ["process map", "flowchart", "workflow", "bpmn", "as-is", "value stream", "sop"]),
    EXCEL("core"),
    sk("Power BI", "important", ["power bi", "powerbi", "dax"]),
    DATAVIZ("important"),
    sk("Data Storytelling", "important", ["storytelling", "executive summary"], ["presented", "presentation", "insights"]),
    sk("Presentation", "nice", ["powerpoint", "presentation", "presented", "pitch", "public speaking"]),
    sk("KPI Design", "nice", ["kpi", "okr", "performance indicator", "scorecard", "metric"]),
  ],
  "Data Analytics": [
    sk("SQL", "core", ["sql", "mysql", "postgres", "sqlite", "bigquery"]),
    sk("Data Cleaning", "core", ["data cleaning", "data cleansing", "data wrangling", "preprocessing", "cleaned", "etl"], ["excel", "pandas"]),
    sk("Joins & Aggregations", "important", ["group by", "aggregation", "inner join", "left join"], ["join", "pivot", "query"]),
    sk("Python", "core", ["python"]),
    sk("Pandas", "important", ["pandas", "numpy", "dataframe"]),
    sk("Exploratory Data Analysis", "important", ["eda", "exploratory", "data analysis", "analysed", "analyzed"], ["insights", "trends"]),
    sk("Statistics", "important", ["statistic", "regression", "probability", "variance", "correlation", "hypothesis"]),
    sk("Hypothesis Testing", "nice", ["hypothesis", "t-test", "p-value", "chi-square", "anova"]),
    AB,
    sk("Tableau", "important", ["tableau"]),
    DATAVIZ("important"),
    sk("Dashboard Design", "nice", ["dashboard", "power bi", "tableau", "looker"]),
  ],
  "AI/ML": [
    sk("Machine Learning", "core", ["machine learning", "scikit", "sklearn", "random forest", "xgboost", "supervised", "clustering", "classification model"]),
    sk("Python", "core", ["python"]),
    sk("Model Evaluation", "important", ["accuracy", "precision", "recall", "f1", "cross-validation", "confusion matrix", "auc", "model evaluation"]),
    sk("Deep Learning", "important", ["deep learning", "cnn", "rnn", "lstm", "tensorflow", "keras", "computer vision", "transformer", "nlp", "natural language"]),
    sk("Neural Networks", "important", ["neural network", "perceptron", "backpropagation", "cnn"]),
    sk("PyTorch", "important", ["pytorch", "torch"]),
    sk("Prompt Engineering", "important", ["prompt", "chatgpt", "gpt", "llm", "openai", "claude", "gemini", "generative ai"]),
    sk("LLM Applications", "important", ["llm", "langchain", "rag", "chatbot", "generative ai", "openai api"]),
    sk("API Integration", "nice", ["api", "apis", "rest", "webhook", "integration"]),
  ],
  "Software Development": [
    sk("HTML", "core", ["html"]),
    sk("CSS", "core", ["css", "tailwind", "bootstrap"]),
    sk("JavaScript", "core", ["javascript", "js", "jquery", "ecmascript"]),
    sk("React", "important", ["react", "next.js", "nextjs", "redux"]),
    sk("TypeScript", "important", ["typescript"]),
    sk("Frontend Development", "important", ["frontend", "front-end", "responsive", "vue", "angular", "react"]),
    sk("Node.js", "important", ["node.js", "nodejs", "express", "backend", "back-end"]),
    sk("REST APIs", "important", ["rest api", "restful", "fastapi", "flask", "django", "spring boot", "endpoint"]),
    sk("Databases", "important", ["mysql", "postgres", "mongodb", "database", "sqlite", "firebase", "sql"]),
    sk("Data Structures", "core", ["data structures", "dsa", "leetcode", "linked list", "binary tree", "codeforces", "competitive programming", "hackerrank"]),
    sk("Algorithms", "core", ["algorithm", "dynamic programming", "leetcode", "time complexity", "competitive programming"]),
    sk("Problem Solving", "nice", ["problem solving", "problem-solving", "competitive programming", "leetcode", "hackathon"]),
  ],
  "Digital Marketing": [
    sk("Marketing Basics", "core", ["marketing", "brand", "campaign", "market research", "advertis", "promotion", "product launch"]),
    sk("Content Marketing", "important", ["content marketing", "blog", "copywriting", "newsletter", "content creation"]),
    sk("Social Media", "core", ["social media", "instagram", "linkedin", "facebook", "twitter", "youtube", "influencer", "community management"]),
    sk("SEO", "important", ["seo", "search engine optimization", "organic traffic", "backlink"]),
    sk("Content Strategy", "important", ["content strategy", "editorial", "content calendar", "content plan"]),
    sk("Keyword Research", "nice", ["keyword", "semrush", "ahrefs"]),
    sk("Google Ads", "important", ["google ads", "adwords", "ppc", "sem", "meta ads", "facebook ads", "paid ads"]),
    sk("Performance Marketing", "core", ["performance marketing", "roas", "cpa", "cac", "paid campaign", "lead generation", "conversion"]),
    sk("Campaign Analytics", "important", ["google analytics", "ga4", "campaign report", "ctr", "impressions", "utm"], ["analytics", "reach"]),
  ],
  Finance: [
    sk("Financial Accounting", "core", ["accounting", "bookkeeping", "tally", "ledger", "journal entries", "gst", "audit", "taxation"]),
    sk("Financial Statements", "core", ["balance sheet", "income statement", "p&l", "profit and loss", "cash flow", "financial statements", "financial analysis"]),
    sk("Budgeting", "important", ["budget", "forecast", "cost control", "fp&a", "variance"]),
    sk("Financial Modeling", "important", ["financial model", "dcf", "three statement", "3-statement", "lbo", "projections"]),
    EXCEL("important"),
    sk("Valuation", "important", ["valuation", "equity research", "comparable", "investment banking", "stock analysis", "portfolio", "cfa"]),
  ],
};

// Transferable strengths detected from any resume, ranked per role by relevance.
const TRANSFER: { name: string; kws: string[] }[] = [
  { name: "Communication", kws: ["communicat", "presented", "presentation", "public speaking", "pitched"] },
  { name: "Teamwork", kws: ["team", "collaborat", "volunteer"] },
  { name: "Leadership", kws: ["led ", "lead ", "leader", "captain", "president", "head of", "co-founder", "founded", "managed a team", "mentor"] },
  { name: "Project Coordination", kws: ["coordinat", "organized", "organised", "event", "logistics", "managed"] },
  { name: "Problem Solving", kws: ["problem solving", "problem-solving", "troubleshoot", "root cause", "optimiz", "optimis"] },
  { name: "Data Analysis", kws: ["data analysis", "analysed", "analyzed", "analytics", "statistic", "insights"] },
  { name: "Excel", kws: ["excel", "spreadsheet", "google sheets"] },
  { name: "Hands-on Engineering", kws: ["robotics", "mechanical", "prototype", "hardware", "cad", "solidworks", "arduino", "embedded", "manufactur"] },
  { name: "Entrepreneurial Mindset", kws: ["co-founder", "founded", "founder's office", "startup", "entrepreneur", "venture"] },
  { name: "Research", kws: ["research", "survey", "interview"] },
  { name: "Writing", kws: ["blog", "article", "copywriting", "content writing", "editor"] },
  { name: "Quantitative Skills", kws: ["mathematic", "calculus", "statistic", "quantitative", "econometric"] },
];
const TRANSFER_RANK: Record<string, string[]> = {
  "Product Management": ["Entrepreneurial Mindset", "Hands-on Engineering", "Project Coordination", "Data Analysis", "Excel", "Leadership", "Communication", "Research", "Problem Solving", "Teamwork"],
  "Project Management": ["Project Coordination", "Leadership", "Teamwork", "Communication", "Problem Solving", "Excel", "Entrepreneurial Mindset"],
  "Business Analytics": ["Data Analysis", "Excel", "Communication", "Problem Solving", "Research", "Project Coordination", "Quantitative Skills"],
  "Data Analytics": ["Data Analysis", "Excel", "Quantitative Skills", "Problem Solving", "Research", "Hands-on Engineering"],
  "AI/ML": ["Quantitative Skills", "Problem Solving", "Data Analysis", "Hands-on Engineering", "Research", "Excel"],
  "Software Development": ["Problem Solving", "Hands-on Engineering", "Quantitative Skills", "Teamwork", "Entrepreneurial Mindset"],
  "Digital Marketing": ["Communication", "Writing", "Research", "Entrepreneurial Mindset", "Teamwork", "Data Analysis", "Leadership"],
  Finance: ["Excel", "Quantitative Skills", "Data Analysis", "Research", "Communication", "Problem Solving"],
};

const DEGREES: [RegExp, string][] = [
  [/\bmba\b|post ?graduate diploma in management/, "MBA"],
  [/mechanical/, "Mechanical Engineering"],
  [/electrical|electronics|e&tc|\bentc\b/, "Electrical/Electronics Engineering"],
  [/computer science|\bcse\b|information technology|\bbca\b|\bmca\b/, "Computer Science"],
  [/civil engineering|\bcivil\b/, "Civil Engineering"],
  [/chemical engineering/, "Chemical Engineering"],
  [/b\.?\s?com\b|commerce/, "Commerce"],
  [/\bbba\b|business administration|management studies/, "Business Administration"],
  [/economics/, "Economics"],
  [/mathematics|statistics/, "Mathematics/Statistics"],
  [/mass communication|journalism/, "Mass Communication"],
  [/b\.?\s?tech|b\.?\s?e\.?\b|bachelor of engineering|engineering/, "Engineering"],
];
const INDUSTRIES: [RegExp, string][] = [
  [/robotics/, "robotics"], [/logistics|supply chain/, "logistics"], [/fintech|banking|\bbank\b/, "finance"], [/edtech/, "edtech"],
  [/healthcare|hospital|pharma/, "healthcare"], [/e-?commerce/, "e-commerce"], [/manufactur/, "manufacturing"], [/automotive|\bev\b/, "automotive"],
  [/consulting/, "consulting"], [/saas/, "SaaS"], [/retail/, "retail"], [/energy|solar/, "energy"], [/media|entertainment/, "media"], [/startup/, "startups"],
];
const ROLES: [RegExp, string][] = [
  [/founder'?s office/, "Founder's Office"], [/co-?founder|\bfounded\b/, "founder"], [/\bintern(ship)?\b/, "internship"], [/\banalyst\b/, "analyst"],
  [/\bengineer\b/, "engineering"], [/\bdeveloper\b/, "development"], [/\bconsultant\b/, "consulting"], [/\bmanager\b/, "management"],
  [/\bcoordinator\b/, "coordination"], [/\bexecutive\b/, "executive"], [/freelanc/, "freelance"], [/research (assistant|intern)/, "research"],
  [/\bdesigner\b/, "design"], [/\btrainee\b/, "trainee"],
];

const norm = (t: string) => t.toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, " ");
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hits = (text: string, kws: string[]) =>
  kws.filter((k) => (k.length <= 4 ? new RegExp(`(^|[^a-z0-9])${esc(k)}([^a-z0-9]|$)`).test(text) : text.includes(k))).length;
const isHeld = (text: string, s: Skill) => hits(text, s.strong) >= 1 || (s.weak.length > 0 && hits(text, s.weak) >= 2);
const first = <T,>(text: string, table: [RegExp, T][]) => table.find(([re]) => re.test(text))?.[1];
const list = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}` : a[0] ?? "");

function extractSignals(text: string) {
  return {
    degree: first(text, DEGREES),
    roles: ROLES.filter(([re]) => re.test(text)).map(([, l]) => l).slice(0, 2),
    industries: INDUSTRIES.filter(([re]) => re.test(text)).map(([, l]) => l).slice(0, 2),
    hasProjects: /project/.test(text),
  };
}

export function demoAnalyze(resume: string, role: string, goal: string): Analysis {
  const text = norm(resume);
  const map = ROLE_SKILLS[role] ?? ROLE_SKILLS["Product Management"];
  const sig = extractSignals(text);

  const heldSkills = map.filter((s) => isHeld(text, s));
  const heldNames = new Set(heldSkills.map((s) => s.name));
  const gaps = map.filter((s) => !heldNames.has(s.name)).sort((a, b) => W[b.tier] - W[a.tier]);
  const tierOf = new Map(map.map((s) => [s.name, s.tier]));
  const gapNames = new Set(gaps.map((s) => s.name));
  const totalW = map.reduce((a, s) => a + W[s.tier], 0);
  const readiness = heldSkills.reduce((a, s) => a + W[s.tier], 0) / totalW; // 0..1

  // Strengths: role skills the resume evidences + transferable strengths ranked for this role
  const rank = TRANSFER_RANK[role] ?? [];
  const heldSorted0 = heldSkills.map((s) => s.name);
  const transferable = TRANSFER.filter((t) => hits(text, t.kws) > 0).map((t) => t.name)
    .filter((t) => !heldSorted0.some((h) => h.includes(t)))
    .sort((a, b) => (rank.indexOf(a) + 99) % 99 - (rank.indexOf(b) + 99) % 99);
  const heldSorted = [...heldSkills].sort((a, b) => W[b.tier] - W[a.tier]).map((s) => s.name);
  let currentSkills = Array.from(new Set([...heldSorted.slice(0, 4), ...transferable])).slice(0, 6);
  if (!currentSkills.length) currentSkills = ["Learning agility"];

  // Score every catalog course by the weighted gaps it closes, adjusted for goal and readiness
  const gw = (n: string) => W[tierOf.get(n)!] * (goal === "Get job-ready" && tierOf.get(n) === "core" ? 1.5 : 1);
  const scored = courses.map((c) => {
    const gapSk = c.skills.filter((n) => gapNames.has(n)).sort((a, b) => gw(b) - gw(a));
    let score = gapSk.reduce((a, n) => a + gw(n), 0);
    const inDomain = c.domain === role;
    if (!inDomain) score *= 0.5;
    if (goal === "Switch careers") score *= c.level === "Beginner" ? 1.3 : c.level === "Advanced" ? 0.6 : 1;
    if (goal === "Build practical skills" && c.level !== "Beginner") score *= 1.2;
    if (goal === "Get a certification" && gapSk.length) score += (c.skills.some((n) => /certification/i.test(n)) ? 4 : 0) + (c.level === "Advanced" ? 1 : 0);
    if (c.level === "Advanced" && readiness < 0.25 && goal !== "Get a certification") score *= 0.5; // build foundations first
    if (c.level === "Beginner" && readiness >= 0.6) score *= 0.7; // already past the basics
    return { c, gapSk, score, inDomain };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);

  const picks: typeof scored = [];
  for (const x of scored) {
    if (picks.length >= 5) break;
    if (!x.inDomain && picks.some((p) => !p.inDomain)) continue; // at most one supporting course from another domain
    picks.push(x);
  }
  if (picks.length < 3) { // strong profile: add level-appropriate domain courses to go deeper
    const want = readiness < 0.4 ? 0 : readiness < 0.7 ? 1 : 2;
    courses.filter((c) => c.domain === role && !picks.some((p) => p.c.id === c.id))
      .sort((a, b) => Math.abs(LEVEL[a.level] - want) - Math.abs(LEVEL[b.level] - want))
      .slice(0, 3 - picks.length).forEach((c) => picks.push({ c, gapSk: [], score: 0, inDomain: true }));
  }

  const anchor = sig.roles.length ? `your ${sig.roles[0]} experience` : heldSorted[0] ? `your ${heldSorted[0]}` : sig.degree ? `your ${sig.degree} background` : "your background";
  const goalTail: Record<string, string> = {
    "Get job-ready": " It's a fast route to job-ready skills.",
    "Build practical skills": " Its hands-on focus suits your goal.",
    "Switch careers": ` It helps you bridge into ${role}.`,
    "Get a certification": " It supports your certification goal.",
  };
  const recs = picks.map(({ c, gapSk }) => {
    const tier = gapSk.length ? tierOf.get(gapSk[0])! : "nice";
    const hasCore = gapSk.some((n) => tierOf.get(n) === "core");
    const hasImp = gapSk.some((n) => tierOf.get(n) === "important");
    const base: Priority = hasCore ? "High" : hasImp ? "Medium" : "Low";
    const priority: Priority = c.domain !== role && base === "High" ? "Medium" : base; // supporting courses from other domains never lead
    const reason = gapSk.length
      ? `Builds on ${anchor}: nothing in your resume shows ${list(gapSk.slice(0, 2)).replace(" and ", " or ")}, ${tier === "core" ? `a core area for ${role}` : `which ${role} teams expect`}.${c.level === "Beginner" && readiness < 0.4 ? " Starts from the basics." : goalTail[goal] ?? ""}`
      : `You already cover most of this, so it deepens ${anchor} at a ${c.level.toLowerCase()} level for ${role}.`;
    return { courseId: c.id, reason, priority, skillsAddressed: gapSk.length ? gapSk.slice(0, 4) : c.skills.slice(0, 3), level: LEVEL[c.level], score: gapSk.reduce((a, n) => a + gw(n), 0) };
  });
  if (recs.length && !recs.some((r) => r.priority === "High")) recs[0].priority = "High";

  // Learning path: High → Medium → Low; within a group go foundations-first unless the profile is already strong
  const P = { High: 0, Medium: 1, Low: 2 };
  recs.sort((a, b) => P[a.priority] - P[b.priority] || (readiness < 0.5 ? a.level - b.level || b.score - a.score : b.score - a.score || a.level - b.level));

  // Summary built from the actual resume
  const exp = sig.roles.length ? `${list(sig.roles)} experience` : sig.hasProjects ? "hands-on project work" : "";
  const ind = sig.industries.length ? ` in ${list(sig.industries)}` : "";
  const s1 = sig.degree ? `${sig.degree} background${exp ? ` with ${exp}` : ""}${ind}.`
    : exp ? `Your resume shows ${exp}${ind}.` : "Your resume shows limited role-specific experience so far.";
  const strengths = currentSkills.filter((s) => s !== "Learning agility").slice(0, 3);
  const g = gaps.slice(0, 2).map((s) => s.name);
  const tail: Record<string, string> = { "Get job-ready": " to get job-ready faster", "Build practical skills": " through hands-on practice", "Switch careers": ` to bridge into ${role}`, "Get a certification": " as you prepare for certification" };
  const s2 = `${strengths.length ? `You already bring ${list(strengths)} to ${role}; ` : ""}${g.length ? `next, focus on ${list(g)}${tail[goal] ?? ""}.` : "you look well matched, so go deeper with intermediate and advanced courses."}`;
  const profileSummary = `${s1} ${s2.charAt(0).toUpperCase()}${s2.slice(1)}`;

  return {
    profileSummary,
    currentSkills,
    skillGaps: gaps.map((s) => s.name).slice(0, 6),
    recommendations: recs.map(({ courseId, reason, priority, skillsAddressed }) => ({ courseId, reason, priority, skillsAddressed })),
  };
}

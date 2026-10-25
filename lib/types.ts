export type Course = {
  id: string; title: string; domain: string; skills: string[];
  level: "Beginner" | "Intermediate" | "Advanced"; duration: string; description: string; url: string;
};
export type Priority = "High" | "Medium" | "Low";
export type Rec = { courseId: string; reason: string; priority: Priority; skillsAddressed: string[]; course?: Course };
export type Analysis = { profileSummary: string; currentSkills: string[]; skillGaps: string[]; recommendations: Rec[] };
export type Result = Analysis & { role: string; goal: string; mode: "ai" | "demo"; note?: string };

export const ROLES = ["Product Management", "Project Management", "Business Analytics", "Data Analytics", "AI/ML", "Software Development", "Digital Marketing", "Finance"];
export const GOALS = ["Get job-ready", "Build practical skills", "Switch careers", "Get a certification"];

export const SAMPLE_RESUME = `Ananya Sharma - B.Com graduate, Pune. 
Experience: Operations intern at a logistics startup (6 months). Built weekly Excel reports tracking delivery delays, coordinated with 4 teams, presented findings to the founder, and ran a small customer survey (120 responses).
Education: B.Com, Savitribai Phule Pune University, 2025. 
Projects: College fest lead - managed a team of 15 volunteers, a Rs 2 lakh budget and sponsor communication. 
Skills: Excel, PowerPoint, communication, teamwork, basic data analysis, problem solving, stakeholder management, time management.`;

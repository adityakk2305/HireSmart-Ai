import {
  BarChart3,
  BrainCircuit,
  CalendarClock,
  FileSearch,
  KeyRound,
  MailCheck,
  MessagesSquare,
  Network,
  ShieldCheck,
  Sparkles
} from "lucide-react";

export const productFeatures = [
  {
    title: "AI Resume Parsing",
    description: "Convert resumes into structured candidate profiles with skills, education, projects and experience.",
    icon: FileSearch
  },
  {
    title: "Candidate Ranking",
    description: "Prioritize applicants using role-specific scoring and recruiter-friendly match categories.",
    icon: BrainCircuit
  },
  {
    title: "Skill Gap Detection",
    description: "See required skills found, missing skills and evidence behind the screening result.",
    icon: Network
  },
  {
    title: "AI Interview Questions",
    description: "Generate interview prompts based on job requirements and candidate resume context.",
    icon: Sparkles
  },
  {
    title: "Interview Scheduling",
    description: "Coordinate candidate movement from shortlist to interview without losing pipeline context.",
    icon: CalendarClock
  },
  {
    title: "Automated Emails",
    description: "Keep candidate communication consistent with status-aware email workflows.",
    icon: MailCheck
  },
  {
    title: "Recruitment Analytics",
    description: "Track candidate volume, shortlist quality, AI score trends and hiring progress.",
    icon: BarChart3
  },
  {
    title: "Role-Based Access",
    description: "Protect hiring data with workspace roles for admins, HR teams and department owners.",
    icon: KeyRound
  },
  {
    title: "Team Collaboration",
    description: "Capture recruiter notes, compare finalists and keep everyone aligned on hiring decisions.",
    icon: MessagesSquare
  },
  {
    title: "Data Security",
    description: "Use secure authentication, private workspaces and careful resume file access controls.",
    icon: ShieldCheck
  }
];

export const featureAvailability = [
  { feature: "AI Resume Parsing", tooltip: "Structured resume extraction for uploaded candidate files.", basic: "Basic", pro: true, business: true },
  { feature: "Candidate Ranking", basic: false, pro: true, business: true },
  { feature: "Skill Gap Detection", basic: false, pro: true, business: true },
  { feature: "AI Interview Questions", basic: false, pro: true, business: true },
  { feature: "Interview Scheduling", basic: false, pro: true, business: true },
  { feature: "Automated Emails", basic: "Basic", pro: true, business: true },
  { feature: "Recruitment Analytics", basic: false, pro: "Core", business: "Advanced" },
  { feature: "Role-Based Access", basic: false, pro: false, business: true },
  { feature: "Team Collaboration", basic: false, pro: "Up to 5 users", business: true },
  { feature: "Data Security", basic: true, pro: true, business: true }
];

export const billingOptions = {
  monthly: {
    label: "Monthly",
    suffix: "/month"
  },
  yearly: {
    label: "Yearly",
    suffix: "/month billed yearly",
    savings: "Save 16%"
  }
};

export const pricingPlans = [
  {
    id: "basic",
    name: "Basic Plan",
    monthlyPrice: 999,
    yearlyMonthlyEquivalent: 839,
    yearlyTotal: 10068,
    description: "For lean HR teams organizing early candidate pipelines.",
    cta: "Start Basic",
    highlight: false,
    features: [
      "2 active job postings",
      "Up to 100 candidate profiles",
      "Basic resume parsing",
      "Manual candidate shortlisting",
      "Basic email notifications",
      "1 HR user",
      "Standard support"
    ],
    limitations: ["AI screening and ranking are not included"]
  },
  {
    id: "pro",
    name: "Pro Plan",
    monthlyPrice: 2499,
    yearlyMonthlyEquivalent: 2099,
    yearlyTotal: 25188,
    description: "For growing recruiting teams that need AI-assisted screening.",
    cta: "Start Pro",
    badge: "Most Popular",
    highlight: true,
    features: [
      "10 active job postings",
      "Up to 1,000 candidate profiles",
      "AI resume screening",
      "AI candidate ranking",
      "Skill gap analysis",
      "AI interview question generation",
      "Interview scheduling",
      "Email automation",
      "Up to 5 HR users",
      "Priority support"
    ],
    limitations: ["Advanced workflows require Business"]
  },
  {
    id: "business",
    name: "Business Plan",
    monthlyPrice: 5999,
    yearlyMonthlyEquivalent: 5039,
    yearlyTotal: 60468,
    description: "For multi-team hiring operations with advanced controls.",
    cta: "Choose Business",
    highlight: false,
    features: [
      "High-limit job postings",
      "High candidate volume",
      "Complete AI screening and ranking",
      "Advanced analytics",
      "Automated candidate communication",
      "Custom recruitment workflows",
      "Multiple departments",
      "Role-based access control",
      "Team collaboration",
      "Custom branding",
      "API or integration access",
      "Dedicated support"
    ],
    limitations: []
  }
];

export const planComparisonRows = [
  { feature: "Active job postings", basic: "2", pro: "10", business: "High limit" },
  { feature: "Candidate profiles", basic: "100", pro: "1,000", business: "High volume" },
  { feature: "Resume parsing", basic: "Basic", pro: "AI assisted", business: "Advanced AI" },
  { feature: "AI candidate ranking", basic: false, pro: true, business: true },
  { feature: "Skill gap analysis", basic: false, pro: true, business: true },
  { feature: "Interview scheduling", basic: false, pro: true, business: true },
  { feature: "Automated emails", basic: "Basic", pro: true, business: true },
  { feature: "Analytics", basic: false, pro: "Core reports", business: "Advanced dashboards" },
  { feature: "HR users", basic: "1", pro: "5", business: "Role based teams" },
  { feature: "Support", basic: "Standard", pro: "Priority", business: "Dedicated" },
  { feature: "API access", basic: false, pro: false, business: true }
];

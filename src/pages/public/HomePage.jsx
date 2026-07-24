import { ArrowRight, BarChart3, BriefcaseBusiness, CheckCircle2, FileSearch, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import FeatureCard from "../../components/marketing/FeatureCard.jsx";
import PricingCard from "../../components/marketing/PricingCard.jsx";
import { pricingPlans } from "../../data/pricingPlans.js";
import { productFeatures } from "../../data/productFeatures.js";
import useAuth from "../../hooks/useAuth.js";

const stats = [
  { label: "Faster resume reviews", value: "70%" },
  { label: "Candidate profiles organized", value: "10k+" },
  { label: "Hiring workflow visibility", value: "24/7" }
];

const workflow = [
  {
    title: "Upload and parse resumes",
    description: "Bring candidate resumes into one workspace and extract the details your recruiters need.",
    icon: FileSearch
  },
  {
    title: "Screen against job criteria",
    description: "Use AI scoring, skills evidence and candidate ranking to find the strongest matches faster.",
    icon: Sparkles
  },
  {
    title: "Move candidates forward",
    description: "Shortlist, reject, place on hold, compare profiles and coordinate next hiring steps.",
    icon: UsersRound
  }
];

const benefits = [
  "Reduce manual resume screening time",
  "Keep candidate decisions consistent",
  "Give HR teams one secure hiring workspace",
  "Surface skill gaps before interview rounds"
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "HireSmart AI | AI Recruitment Platform";
  }, []);

  return (
    <>
      <section className="overflow-hidden bg-white dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              AI recruitment workspace for modern HR teams
            </div>
            <h1 className="max-w-4xl text-4xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Hire smarter. Screen faster. Build better teams.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              HireSmart AI helps recruitment teams screen resumes, rank candidates, automate communication and schedule interviews from one intelligent workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button size="lg" icon={ArrowRight}>
                  Start Hiring Smarter
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="rounded-lg bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="text-sm text-slate-300">AI ranking snapshot</p>
                    <p className="text-2xl font-bold">Senior MERN Developer</p>
                  </div>
                  <ShieldCheck className="h-8 w-8 text-blue-400" aria-hidden="true" />
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    ["Aarav Mehta", "Excellent Match", "94"],
                    ["Nisha Rao", "Good Match", "86"],
                    ["Kabir Shah", "Average Match", "72"]
                  ].map(([name, category, score]) => (
                    <div key={name} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg bg-white/10 p-4">
                      <div>
                        <p className="font-semibold">{name}</p>
                        <p className="mt-1 text-sm text-slate-300">{category}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">
                        {score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-8 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white p-5 text-center shadow-sm dark:bg-slate-900">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Everything HR needs to screen with confidence</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Keep resume data, AI evidence, candidate movement and recruiter decisions in one focused workflow.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {productFeatures.slice(0, 4).map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <h2 className="text-3xl font-bold text-slate-950 dark:text-white">How it works</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Move from resume intake to actionable candidate decisions without stitching together spreadsheets, inboxes and disconnected notes.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {workflow.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-300">Step {index + 1}</p>
                      <Icon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <h3 className="mt-3 text-base font-bold text-slate-950 dark:text-white">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
              <BarChart3 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Built for practical HR outcomes</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Give your team faster screening, clearer evidence and better candidate follow-through without adding operational complexity.
            </p>
          </div>
          <div className="grid gap-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 dark:text-green-300" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Plans that grow with your hiring team</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Start small, add AI workflow depth when your hiring volume grows.</p>
            </div>
            <Link to="/pricing">
              <Button variant="outline">View all pricing</Button>
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} billing="monthly" isAuthenticated={isAuthenticated} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-600 py-14 text-white dark:bg-blue-700">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <BriefcaseBusiness className="h-10 w-10" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-bold">Ready to make hiring decisions easier?</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
            Create your HireSmart AI workspace and give your recruiting team a faster, clearer way to move candidates forward.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="mt-7">
            <Button size="lg" variant="secondary" icon={ArrowRight}>
              {isAuthenticated ? "Open Dashboard" : "Create HR Account"}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;

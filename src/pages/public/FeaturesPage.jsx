import { useEffect } from "react";
import FeatureCard from "../../components/marketing/FeatureCard.jsx";
import PlanComparisonTable from "../../components/marketing/PlanComparisonTable.jsx";
import { featureAvailability, productFeatures } from "../../data/productFeatures.js";

const FeaturesPage = () => {
  useEffect(() => {
    document.title = "Features | HireSmart AI";
  }, []);

  return (
    <>
      <section className="bg-white py-14 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">Features</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950 dark:text-white sm:text-5xl">
              AI-powered hiring workflows without the operational clutter
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              HireSmart AI brings resume parsing, candidate ranking, recruiter review and team collaboration into one secure SaaS workspace.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productFeatures.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Plan feature comparison</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              See which plan includes each product capability. On smaller screens, scroll the table horizontally without breaking the page layout.
            </p>
          </div>
          <PlanComparisonTable rows={featureAvailability} />
        </div>
      </section>
    </>
  );
};

export default FeaturesPage;

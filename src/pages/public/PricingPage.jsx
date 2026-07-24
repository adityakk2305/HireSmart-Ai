import { useEffect, useState } from "react";
import PlanComparisonTable from "../../components/marketing/PlanComparisonTable.jsx";
import PricingCard from "../../components/marketing/PricingCard.jsx";
import { billingOptions, planComparisonRows, pricingPlans } from "../../data/pricingPlans.js";
import useAuth from "../../hooks/useAuth.js";

const PricingPage = () => {
  const [billing, setBilling] = useState("monthly");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Pricing | HireSmart AI";
  }, []);

  return (
    <>
      <section className="bg-white py-14 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-600 dark:text-blue-300">Pricing</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950 dark:text-white sm:text-5xl">Choose the hiring plan that fits your team</h1>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              Transparent plans for HR teams moving from manual resume review to AI-assisted recruitment workflows.
            </p>
            <div className="mt-8 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900">
              {Object.entries(billingOptions).map(([key, option]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBilling(key)}
                  className={`rounded-md px-4 py-2 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    billing === key
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300"
                  }`}
                >
                  {option.label}
                  {key === "yearly" ? <span className="ml-2 text-xs opacity-80">{billingOptions.yearly.savings}</span> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} billing={billing} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white">Compare plan limits</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Feature limits are kept in one configuration file so the pricing page can be updated cleanly as packaging evolves.
            </p>
          </div>
          <PlanComparisonTable rows={planComparisonRows} />
        </div>
      </section>
    </>
  );
};

export default PricingPage;

import { CheckCircle2, MinusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button.jsx";

const formatINR = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(value);

const PricingCard = ({ plan, billing, isAuthenticated }) => {
  const price = billing === "yearly" ? plan.yearlyMonthlyEquivalent : plan.monthlyPrice;
  const ctaPath = isAuthenticated ? "/dashboard" : "/register";

  return (
    <article className={`relative flex h-full flex-col rounded-lg border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 ${
      plan.highlight
        ? "border-blue-500 ring-2 ring-blue-500/15"
        : "border-slate-200 dark:border-slate-700"
    }`}>
      {plan.badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {plan.badge}
        </span>
      ) : null}
      <h3 className="pr-28 text-xl font-bold text-slate-950 dark:text-white">{plan.name}</h3>
      <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600 dark:text-slate-300">{plan.description}</p>
      <div className="mt-6">
        <p className="text-4xl font-bold text-slate-950 dark:text-white">{formatINR(price)}</p>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          {billing === "yearly" ? `/month, ${formatINR(plan.yearlyTotal)} billed yearly` : "/month"}
        </p>
      </div>
      <Link to={ctaPath} className="mt-6">
        <Button className="w-full" variant={plan.highlight ? "primary" : "outline"}>
          {plan.cta}
        </Button>
      </Link>
      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm leading-5 text-slate-700 dark:text-slate-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-300" aria-hidden="true" />
            {feature}
          </li>
        ))}
        {plan.limitations.map((limitation) => (
          <li key={limitation} className="flex gap-2 text-sm leading-5 text-slate-500 dark:text-slate-400">
            <MinusCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {limitation}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default PricingCard;

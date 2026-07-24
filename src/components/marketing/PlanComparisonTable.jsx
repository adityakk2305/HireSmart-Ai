import { Check, HelpCircle, Minus } from "lucide-react";

const renderValue = (value) => {
  if (value === true) return <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-300" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto h-5 w-5 text-slate-400" aria-label="Not included" />;
  return <span>{value}</span>;
};

const PlanComparisonTable = ({ rows }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <table className="min-w-[760px] w-full text-left text-sm">
      <thead className="bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        <tr>
          <th className="px-4 py-4 font-bold">Feature</th>
          <th className="px-4 py-4 text-center font-bold">Basic</th>
          <th className="px-4 py-4 text-center font-bold">Pro</th>
          <th className="px-4 py-4 text-center font-bold">Business</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
        {rows.map((row) => (
          <tr key={row.feature} className="text-slate-700 dark:text-slate-200">
            <td className="px-4 py-4 font-semibold">
              <span className="inline-flex items-center gap-2">
                {row.feature}
                {row.tooltip ? (
                  <span title={row.tooltip} className="text-slate-400">
                    <HelpCircle className="h-4 w-4" aria-hidden="true" />
                  </span>
                ) : null}
              </span>
            </td>
            <td className="px-4 py-4 text-center">{renderValue(row.basic)}</td>
            <td className="px-4 py-4 text-center">{renderValue(row.pro)}</td>
            <td className="px-4 py-4 text-center">{renderValue(row.business)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default PlanComparisonTable;

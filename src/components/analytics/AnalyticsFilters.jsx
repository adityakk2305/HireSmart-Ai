import { Download, Printer, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../common/Button.jsx";

const presets = [
  ["last-30-days", "Last 30 days"],
  ["last-7-days", "Last 7 days"],
  ["last-90-days", "Last 90 days"],
  ["today", "Today"],
  ["this-month", "This month"],
  ["this-year", "This year"],
  ["custom", "Custom"]
];

const AnalyticsFilters = ({ onChange, onExport, showPrint = true }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    preset: searchParams.get("preset") || "last-30-days",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
    comparePrevious: searchParams.get("comparePrevious") === "true",
    grouping: searchParams.get("grouping") || "day",
    department: searchParams.get("department") || "",
    jobId: searchParams.get("jobId") || "",
    recruiterId: searchParams.get("recruiterId") || ""
  });

  useEffect(() => {
    onChange?.(filters);
  }, []);

  const update = (patch) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== "" && value !== false && value !== null && value !== undefined) params.set(key, String(value));
    });
    setSearchParams(params);
    onChange?.(next);
  };

  return (
    <section className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm print:hidden">
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
        <label className="text-sm font-semibold text-slate-700">
          Date range
          <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={filters.preset} onChange={(event) => update({ preset: event.target.value })}>
            {presets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          From
          <input type="date" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={filters.dateFrom} onChange={(event) => update({ dateFrom: event.target.value, preset: "custom" })} />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          To
          <input type="date" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={filters.dateTo} onChange={(event) => update({ dateTo: event.target.value, preset: "custom" })} />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Department
          <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={filters.department} onChange={(event) => update({ department: event.target.value })} placeholder="Any" />
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Grouping
          <select className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={filters.grouping} onChange={(event) => update({ grouping: event.target.value })}>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </label>
        <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={filters.comparePrevious} onChange={(event) => update({ comparePrevious: event.target.checked })} />
          Compare
        </label>
        <div className="flex items-end gap-2">
          <Button type="button" variant="outline" icon={RefreshCw} onClick={() => onChange?.(filters)}>Refresh</Button>
          {onExport ? <Button type="button" variant="outline" icon={Download} onClick={() => onExport(filters)} /> : null}
          {showPrint ? <Button type="button" variant="outline" icon={Printer} onClick={() => window.print()} /> : null}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsFilters;

import { Inbox } from "lucide-react";

const EmptyState = ({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className = ""
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center ${className}`}
  >
    <div className="mb-4 rounded-full bg-blue-50 p-3 text-blue-600">
      <Icon className="h-6 w-6" aria-hidden="true" />
    </div>
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);

export default EmptyState;

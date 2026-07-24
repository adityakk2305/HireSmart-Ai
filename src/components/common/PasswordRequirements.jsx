import { CheckCircle2, Circle } from "lucide-react";
import { getPasswordRequirementState } from "../../utils/passwordValidation.js";

const PasswordRequirements = ({ password, confirmPassword }) => {
  const requirements = getPasswordRequirementState(password, confirmPassword);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/70">
      <p className="text-sm font-bold text-slate-700 dark:text-slate-100">Password requirements</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {requirements.map((item) => {
          const Icon = item.valid ? CheckCircle2 : Circle;

          return (
            <p
              key={item.id}
              className={`flex items-center gap-2 text-sm font-medium ${
                item.valid ? "text-green-700 dark:text-green-300" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordRequirements;

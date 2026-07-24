import { EMAIL_VARIABLE_GROUPS } from "../../utils/emailConstants.js";

const EmailVariablePicker = ({ onInsert }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4">
    <p className="text-sm font-bold text-slate-950">Approved variables</p>
    <div className="mt-3 grid gap-4 md:grid-cols-2">
      {Object.entries(EMAIL_VARIABLE_GROUPS).map(([group, variables]) => (
        <div key={group}>
          <p className="text-xs font-bold uppercase text-slate-400">{group}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variables.map((variable) => (
              <button
                key={variable}
                type="button"
                onClick={() => onInsert?.(`{{${variable}}}`)}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
              >
                {variable}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EmailVariablePicker;

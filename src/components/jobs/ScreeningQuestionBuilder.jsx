import { Plus, Trash2 } from "lucide-react";
import { SCREENING_QUESTION_TYPES } from "../../utils/constants.js";
import Button from "../common/Button.jsx";
import Input from "../common/Input.jsx";

const ScreeningQuestionBuilder = ({ value = [], onChange, error }) => {
  const updateQuestion = (index, updates) => {
    const next = [...value];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const addQuestion = () => {
    if (value.length >= 20) return;
    onChange([
      ...value,
      { key: `question-${Date.now()}`, question: "", type: "text", required: false, options: [], order: value.length }
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">Screening questions</label>
        <Button type="button" size="sm" variant="outline" icon={Plus} onClick={addQuestion}>
          Add question
        </Button>
      </div>
      {value.map((item, index) => (
        <div key={item.key || index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
            <Input
              name={`question-${index}`}
              placeholder="Question"
              value={item.question}
              onChange={(event) => updateQuestion(index, { question: event.target.value })}
            />
            <select
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm"
              value={item.type}
              onChange={(event) => updateQuestion(index, { type: event.target.value, options: event.target.value === "select" ? item.options : [] })}
            >
              {SCREENING_QUESTION_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
            <Button type="button" variant="danger" icon={Trash2} onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>
              Delete
            </Button>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={Boolean(item.required)}
              onChange={(event) => updateQuestion(index, { required: event.target.checked })}
            />
            Required
          </label>
          {item.type === "select" ? (
            <Input
              name={`options-${index}`}
              label="Options"
              helperText="Separate options with commas."
              value={(item.options || []).join(", ")}
              onChange={(event) => updateQuestion(index, { options: event.target.value.split(",").map((option) => option.trim()) })}
            />
          ) : null}
        </div>
      ))}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default ScreeningQuestionBuilder;

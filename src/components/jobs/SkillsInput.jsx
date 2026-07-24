import { X } from "lucide-react";
import { useState } from "react";

const SkillsInput = ({ label, value = [], onChange, max = 30, required = false, error }) => {
  const [input, setInput] = useState("");

  const addSkill = (rawSkill) => {
    const skill = rawSkill.trim();
    if (!skill || value.length >= max) return;
    if (value.some((item) => item.toLowerCase() === skill.toLowerCase())) return;
    onChange([...value, skill]);
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill(input.replace(",", ""));
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addSkill(input)}
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
        placeholder="Type a skill and press Enter"
      />
      <div className="flex flex-wrap gap-2">
        {value.map((skill) => (
          <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
            {skill}
            <button type="button" onClick={() => onChange(value.filter((item) => item !== skill))}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default SkillsInput;

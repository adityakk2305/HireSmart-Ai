import { Plus, Trash2 } from "lucide-react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";

const ResponsibilitiesInput = ({ value = [], onChange, error }) => {
  const updateItem = (index, nextValue) => {
    const next = [...value];
    next[index] = nextValue;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">Responsibilities <span className="text-red-600">*</span></label>
        <Button type="button" size="sm" variant="outline" icon={Plus} onClick={() => value.length < 30 && onChange([...value, ""])}>
          Add
        </Button>
      </div>
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input name={`responsibility-${index}`} value={item} onChange={(event) => updateItem(index, event.target.value)} placeholder={`Responsibility ${index + 1}`} />
          <Button type="button" variant="danger" icon={Trash2} onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>
            Remove
          </Button>
        </div>
      ))}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default ResponsibilitiesInput;

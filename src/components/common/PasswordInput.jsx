import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Input from "./Input.jsx";

const PasswordInput = ({ label = "Password", name, value, onChange, error, autoComplete, placeholder, required = false }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        autoComplete={autoComplete}
        required={required}
        className="pr-11"
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-3 top-9 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
      >
        {visible ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  );
};

export default PasswordInput;

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  className = "",
  ...props
}) => {
  const describedBy = error ? `${name}-error` : helperText ? `${name}-helper` : undefined;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={name} className="block text-sm font-semibold text-slate-700">
          {label} {required ? <span className="text-red-600">*</span> : null}
        </label>
      ) : null}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20 ${
          error ? "border-red-400" : "border-slate-300"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p id={`${name}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${name}-helper`} className="text-sm text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Input;

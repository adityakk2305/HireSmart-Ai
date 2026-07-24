import { FileText, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import Button from "../common/Button.jsx";
import { formatFileSize } from "../../utils/formatFileSize.js";

const acceptedExtensions = [".pdf", ".docx"];
const maxSize = 5 * 1024 * 1024;

const validateFile = (file) => {
  if (!file) return "Resume is required";
  const lowerName = file.name.toLowerCase();
  const extension = lowerName.slice(lowerName.lastIndexOf("."));
  const extensionCount = (lowerName.match(/\.[a-z0-9]+/g) || []).length;

  if (!acceptedExtensions.includes(extension) || extensionCount > 1) {
    return "Upload a PDF or DOCX resume only";
  }

  if (file.size <= 0) {
    return "Resume cannot be empty";
  }

  if (file.size > maxSize) {
    return "Resume must be 5 MB or smaller";
  }

  return "";
};

const ResumeUploadField = ({ value, onChange, error }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");

  const selectFile = (file) => {
    const validationError = validateFile(file);
    setLocalError(validationError);

    if (!validationError) {
      onChange(file);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">Resume</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          selectFile(event.dataTransfer.files?.[0]);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-6 py-8 text-center transition ${
          dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white hover:bg-slate-50"
        }`}
      >
        <Upload className="h-7 w-7 text-blue-600" aria-hidden="true" />
        <span className="mt-3 text-sm font-bold text-slate-800">Drop resume here or choose a file</span>
        <span className="mt-1 text-xs text-slate-500">PDF or DOCX, maximum 5 MB</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(event) => selectFile(event.target.files?.[0])}
      />
      {value ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">{value.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(value.size)}</p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm" icon={X} onClick={() => onChange(null)}>
            Remove
          </Button>
        </div>
      ) : null}
      {localError || error ? <p className="mt-2 text-sm text-red-600">{localError || error}</p> : null}
    </div>
  );
};

export default ResumeUploadField;

const ScreeningAnswersForm = ({ questions = [], answers, onChange, errors = {} }) => {
  const setAnswer = (questionId, answer) => {
    onChange({ ...answers, [questionId]: answer });
  };

  if (!questions.length) {
    return <p className="text-sm text-slate-500">No screening questions are required for this job.</p>;
  }

  return (
    <div className="space-y-4">
      {questions
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((question) => (
          <div key={question.key} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="block text-sm font-bold text-slate-800">
              {question.question}
              {question.required ? <span className="text-red-600"> *</span> : null}
            </label>
            {question.type === "textarea" ? (
              <textarea
                className="mt-3 min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                value={answers[question.key] || ""}
                onChange={(event) => setAnswer(question.key, event.target.value)}
              />
            ) : null}
            {question.type === "text" ? (
              <input
                className="mt-3 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
                value={answers[question.key] || ""}
                onChange={(event) => setAnswer(question.key, event.target.value)}
              />
            ) : null}
            {question.type === "number" ? (
              <input
                type="number"
                className="mt-3 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
                value={answers[question.key] || ""}
                onChange={(event) => setAnswer(question.key, event.target.value)}
              />
            ) : null}
            {question.type === "select" ? (
              <select
                className="mt-3 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm"
                value={answers[question.key] || ""}
                onChange={(event) => setAnswer(question.key, event.target.value)}
              >
                <option value="">Select an answer</option>
                {(question.options || []).map((option) => <option key={option}>{option}</option>)}
              </select>
            ) : null}
            {question.type === "yes-no" ? (
              <div className="mt-3 flex gap-4">
                {["yes", "no"].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="radio"
                      name={question.key}
                      checked={answers[question.key] === option}
                      onChange={() => setAnswer(question.key, option)}
                    />
                    {option === "yes" ? "Yes" : "No"}
                  </label>
                ))}
              </div>
            ) : null}
            {errors[question.key] ? <p className="mt-2 text-sm text-red-600">{errors[question.key]}</p> : null}
          </div>
        ))}
    </div>
  );
};

export default ScreeningAnswersForm;

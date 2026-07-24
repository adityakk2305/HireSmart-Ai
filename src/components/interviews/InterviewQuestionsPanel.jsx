import Button from "../common/Button.jsx";

const InterviewQuestionsPanel = ({ interview, loading, onGenerate }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-950">Interview questions</h2>
        <p className="mt-1 text-sm text-slate-500">Expected answers and criteria are HR-only.</p>
      </div>
      <Button loading={loading} onClick={onGenerate}>Generate mock AI questions</Button>
    </div>
    <div className="mt-5 grid gap-4">
      {[...(interview?.generatedQuestions || []), ...(interview?.customQuestions || [])].map((question) => (
        <article key={question._id || question.question} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
            <span>{question.category}</span>
            <span>{question.difficulty}</span>
            <span>{question.source}</span>
          </div>
          <p className="font-semibold text-slate-950">{question.question}</p>
          {question.expectedAnswer ? <p className="mt-2 text-sm text-slate-600"><span className="font-bold">Expected:</span> {question.expectedAnswer}</p> : null}
          {question.evaluationCriteria ? <p className="mt-2 text-sm text-slate-600"><span className="font-bold">Criteria:</span> {question.evaluationCriteria}</p> : null}
        </article>
      ))}
      {!interview?.generatedQuestions?.length && !interview?.customQuestions?.length ? <p className="text-sm text-slate-500">No questions generated yet.</p> : null}
    </div>
  </section>
);

export default InterviewQuestionsPanel;

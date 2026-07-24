import Button from "../common/Button.jsx";

const CandidatePagination = ({ pagination, onPageChange }) => {
  if (!pagination?.pages || pagination.pages <= 1) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">
        Page {pagination.page} of {pagination.pages} - {pagination.total} candidates
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={!pagination.hasPreviousPage} onClick={() => onPageChange(pagination.page - 1)}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => onPageChange(pagination.page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default CandidatePagination;

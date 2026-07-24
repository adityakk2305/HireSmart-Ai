import Button from "./Button.jsx";
import Modal from "./Modal.jsx";

const ConfirmationDialog = ({
  open,
  title = "Confirm action",
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  onConfirm,
  onCancel
}) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title}
    footer={
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    }
  >
    <p className="text-sm leading-6 text-slate-600">{description}</p>
  </Modal>
);

export default ConfirmationDialog;

interface IConfirmModal {
  description: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  title: string;
  warningText?: string;
}

export default IConfirmModal;

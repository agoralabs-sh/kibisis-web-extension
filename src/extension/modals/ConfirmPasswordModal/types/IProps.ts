interface IProps {
  hint?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (password: string) => void;
}

export default IProps;

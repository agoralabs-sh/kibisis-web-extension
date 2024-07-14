// errors
import { BaseExtensionError } from '@extension/errors';

interface IProps {
  isOpen: boolean;
  hint?: string;
  onCancel: () => void;
  onConfirm: (password: string) => void;
}

export default IProps;

// types
import type { IModalProps } from '@extension/types';

interface IProps extends IModalProps {
  hint?: string;
  isOpen: boolean;
  onConfirm: (password: string) => void;
}

export default IProps;

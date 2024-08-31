// types
import type { IModalProps } from '@extension/types';

interface IProps extends IModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default IProps;

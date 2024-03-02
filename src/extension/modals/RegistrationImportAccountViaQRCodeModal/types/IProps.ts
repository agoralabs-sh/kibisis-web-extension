// types
import type { IAddAccountCompleteFunction } from '@extension/types';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: IAddAccountCompleteFunction;
  saving: boolean;
}

export default IProps;

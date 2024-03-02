// types
import type { IRegistrationAddAccountCompleteResult } from '@extension/types';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: IRegistrationAddAccountCompleteResult) => Promise<void>;
  saving: boolean;
}

export default IProps;

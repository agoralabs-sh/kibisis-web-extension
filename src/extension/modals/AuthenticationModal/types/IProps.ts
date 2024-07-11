// errors
import { BaseExtensionError } from '@extension/errors';

// types
import TOnConfirmResult from './TOnConfirmResult';

interface IProps {
  isOpen: boolean;
  passwordHint?: string;
  onCancel: () => void;
  onConfirm: (result: TOnConfirmResult) => void;
  onError?: (error: BaseExtensionError) => void;
}

export default IProps;

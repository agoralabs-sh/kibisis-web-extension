// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type { IModalProps } from '@extension/types';
import type TOnConfirmResult from './TOnConfirmResult';

interface IProps extends IModalProps {
  isOpen: boolean;
  passwordHint?: string;
  onConfirm: (result: TOnConfirmResult) => void;
  onError?: (error: BaseExtensionError) => void;
}

export default IProps;

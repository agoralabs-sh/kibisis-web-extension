// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type { IModalProps, TEncryptionCredentials } from '@extension/types';

interface IProps extends IModalProps {
  forceAuthentication?: boolean;
  isOpen: boolean;
  passwordHint?: string;
  onConfirm: (result: TEncryptionCredentials) => void;
  onError?: (error: BaseExtensionError) => void;
}

export default IProps;

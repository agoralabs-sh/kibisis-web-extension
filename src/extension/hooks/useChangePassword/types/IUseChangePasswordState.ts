// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type { IEncryptionState } from '@extension/components/ReEncryptKeysLoadingContent';
import type { IPasswordTag } from '@extension/types';
import type IChangePasswordActionOptions from './IChangePasswordActionOptions';

interface IUseChangePasswordState {
  changePasswordAction: (
    options: IChangePasswordActionOptions
  ) => Promise<void>;
  encryptionProgressState: IEncryptionState[];
  encrypting: boolean;
  error: BaseExtensionError | null;
  passwordTag: IPasswordTag | null;
  resetAction: () => void;
  validating: boolean;
}

export default IUseChangePasswordState;

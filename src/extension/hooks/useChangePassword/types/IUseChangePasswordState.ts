// Errors
import { BaseExtensionError } from '@extension/errors';

// Types
import { IPasswordTag } from '@extension/types';

interface IUseChangePasswordState {
  changePassword: (
    newPassword: string,
    currentPassword: string
  ) => Promise<void>;
  error: BaseExtensionError | null;
  passwordTag: IPasswordTag | null;
  saving: boolean;
}

export default IUseChangePasswordState;

// errors
import { BaseExtensionError } from '@extension/errors';

// types
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

// Errors
import { BaseExtensionError } from '@extension/errors';

// Types
import { IPksPasswordTagStorageItem } from '@extension/types';

interface IUseChangePasswordState {
  changePassword: (
    newPassword: string,
    currentPassword: string
  ) => Promise<void>;
  error: BaseExtensionError | null;
  passwordTag: IPksPasswordTagStorageItem | null;
  saving: boolean;
}

export default IUseChangePasswordState;

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type { IPasswordTag } from '@extension/types';
import type IChangePasswordActionOptions from './IChangePasswordActionOptions';

interface IUseChangePasswordState {
  changePasswordAction: (
    options: IChangePasswordActionOptions
  ) => Promise<void>;
  count: number;
  encrypting: boolean;
  error: BaseExtensionError | null;
  passwordTag: IPasswordTag | null;
  resetAction: () => void;
  validating: boolean;
  total: number;
}

export default IUseChangePasswordState;

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type { IEncryptionState } from '@extension/components/ReEncryptKeysLoadingContent';
import type IRemovePasskeyActionOptions from './IRemovePasskeyActionOptions';

interface IState {
  removePasskeyAction: (options: IRemovePasskeyActionOptions) => Promise<void>;
  encryptionProgressState: IEncryptionState[];
  encrypting: boolean;
  error: BaseExtensionError | null;
  requesting: boolean;
  resetAction: () => void;
}

export default IState;

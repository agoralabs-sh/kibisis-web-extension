// errors
import { BaseExtensionError } from '@extension/errors';

// types
import type { IEncryptionState } from '@extension/components/ReEncryptKeysLoadingContent';
import type { IPasskeyCredential } from '@extension/types';
import type IAddPasskeyActionOptions from './IAddPasskeyActionOptions';

interface IState {
  addPasskeyAction: (options: IAddPasskeyActionOptions) => Promise<void>;
  encryptionProgressState: IEncryptionState[];
  encrypting: boolean;
  error: BaseExtensionError | null;
  passkey: IPasskeyCredential | null;
  requesting: boolean;
  resetAction: () => void;
}

export default IState;

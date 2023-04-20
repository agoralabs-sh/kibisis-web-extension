// Errors
import { BaseExtensionError } from '@extension/errors';

// Types
import ISignBytesOptions from './ISignBytesOptions';

interface IUseSignTransactionsState {
  encodedSignedBytes: string | null;
  error: BaseExtensionError | null;
  resetError: () => void;
  signBytes: (options: ISignBytesOptions) => Promise<void>;
}

export default IUseSignTransactionsState;

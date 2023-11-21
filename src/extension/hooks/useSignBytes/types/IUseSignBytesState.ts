// errors
import { BaseExtensionError } from '@extension/errors';

// types
import ISignBytesOptions from './ISignBytesOptions';

interface IUseSignBytesState {
  encodedSignedBytes: string | null;
  error: BaseExtensionError | null;
  resetError: () => void;
  signBytes: (options: ISignBytesOptions) => Promise<void>;
}

export default IUseSignBytesState;

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import ISignTransactionsOptions from 'src/extension/hooks/useSignTxns/types/ISignTransactionsOptions';

interface IUseSignTransactionsState {
  encodedSignedTransactions: (string | null)[];
  error: BaseExtensionError | null;
  resetError: () => void;
  signTransactions: (options: ISignTransactionsOptions) => Promise<void>;
}

export default IUseSignTransactionsState;

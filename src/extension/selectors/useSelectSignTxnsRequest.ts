import { useSelector } from 'react-redux';

// Types
import { IMainRootState, ISignTxnsRequest } from '@extension/types';

/**
 * Selects the current sign transaction request, or null if none exists.
 * @returns {ISignBytesRequest | null} the current sign transaction request or null if it does not exist.
 */
export default function useSelectSignTxnsRequest(): ISignTxnsRequest | null {
  return useSelector<IMainRootState, ISignTxnsRequest | null>(
    (state) => state.messages.signTxnsRequest
  );
}

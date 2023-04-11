import { useSelector } from 'react-redux';

// Types
import { IMainRootState, ISignBytesRequest } from '@extension/types';

/**
 * Selects the current sign bytes request, or null if none exists.
 * @returns {ISignBytesRequest | null} the current sign bytes request or null if it does not exist.
 */
export default function useSelectSignBytesRequest(): ISignBytesRequest | null {
  return useSelector<IMainRootState, ISignBytesRequest | null>(
    (state) => state.messages.signBytesRequest
  );
}

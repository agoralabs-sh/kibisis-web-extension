import type { ISignTransactionsParams } from '@agoralabs-sh/avm-web-provider';
import { useSelector } from 'react-redux';

// types
import type { IClientRequestEvent, IMainRootState } from '@extension/types';

/**
 * Selects the current sign transaction request, or null if none exists.
 * @returns {IClientRequestEvent<ISignTransactionsParams> | null} the current sign transaction request or null if it does not exist.
 */
export default function useSelectSignTransactionsRequest(): IClientRequestEvent<ISignTransactionsParams> | null {
  return useSelector<
    IMainRootState,
    IClientRequestEvent<ISignTransactionsParams> | null
  >((state) => state.events.signTransactionsRequest);
}

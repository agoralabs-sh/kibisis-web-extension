import type { ISignTransactionsParams } from '@agoralabs-sh/avm-web-provider';
import { useSelector } from 'react-redux';

// types
import type {
  IClientRequestEventPayload,
  IEvent,
  IMainRootState,
} from '@extension/types';

/**
 * Selects the current sign transaction request, or null if none exists.
 * @returns {IEvent<IClientRequestEventPayload<ISignTransactionsParams>> | null} the current sign transaction request or null if it does not exist.
 */
export default function useSelectSignTransactionsRequest(): IEvent<
  IClientRequestEventPayload<ISignTransactionsParams>
> | null {
  return useSelector<
    IMainRootState,
    IEvent<IClientRequestEventPayload<ISignTransactionsParams>> | null
  >((state) => state.events.signTransactionsRequest);
}

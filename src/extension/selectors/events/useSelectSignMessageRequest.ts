import type { ISignMessageParams } from '@agoralabs-sh/avm-web-provider';
import { useSelector } from 'react-redux';

// types
import type {
  IClientRequestEventPayload,
  IEvent,
  IMainRootState,
} from '@extension/types';

/**
 * Selects the current sign message request, or null if none exists.
 * @returns {IEvent<IClientRequestEventPayload<ISignMessageParams>> | null} the current sign message request or null if it does not exist.
 */
export default function useSelectSignMessageRequest(): IEvent<
  IClientRequestEventPayload<ISignMessageParams>
> | null {
  return useSelector<
    IMainRootState,
    IEvent<IClientRequestEventPayload<ISignMessageParams>> | null
  >((state) => state.events.signMessageRequest);
}

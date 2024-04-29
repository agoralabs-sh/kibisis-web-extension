import type { IEnableParams } from '@agoralabs-sh/avm-web-provider';
import { useSelector } from 'react-redux';

// types
import type {
  IClientRequestEventPayload,
  IEvent,
  IMainRootState,
} from '@extension/types';

/**
 * Selects the current enable request, or null if none exists.
 * @returns {IEvent<IClientRequestEventPayload<IEnableParams>> | null} the current enable request or null if it does not exist.
 */
export default function useSelectEnableRequest(): IEvent<
  IClientRequestEventPayload<IEnableParams>
> | null {
  return useSelector<
    IMainRootState,
    IEvent<IClientRequestEventPayload<IEnableParams>> | null
  >((state) => state.events.enableRequest);
}

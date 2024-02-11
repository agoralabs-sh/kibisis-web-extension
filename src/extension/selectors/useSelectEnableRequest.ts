import { useSelector } from 'react-redux';

// messages
import { ARC0027EnableRequestMessage } from '@common/messages';

// types
import { IClientRequest, IMainRootState } from '@extension/types';

/**
 * Selects the current enable request, or null if none exists.
 * @returns {IClientRequest<ARC0027EnableRequestMessage> | null} the current enable request or null if it does not exist.
 */
export default function useSelectEnableRequest(): IClientRequest<ARC0027EnableRequestMessage> | null {
  return useSelector<
    IMainRootState,
    IClientRequest<ARC0027EnableRequestMessage> | null
  >((state) => state.events.enableRequest);
}

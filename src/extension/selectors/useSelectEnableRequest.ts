import { useSelector } from 'react-redux';

// messages
import { Arc0013EnableRequestMessage } from '@common/messages';

// types
import { IClientRequest, IMainRootState } from '@extension/types';

/**
 * Selects the current enable request, or null if none exists.
 * @returns {IClientRequest<Arc0013EnableRequestMessage> | null} the current enable request or null if it does not exist.
 */
export default function useSelectEnableRequest(): IClientRequest<Arc0013EnableRequestMessage> | null {
  return useSelector<
    IMainRootState,
    IClientRequest<Arc0013EnableRequestMessage> | null
  >((state) => state.events.enableRequest);
}

import { useSelector } from 'react-redux';

// messages
import { Arc0013SignBytesRequestMessage } from '@common/messages';

// types
import { IClientRequest, IMainRootState } from '@extension/types';

/**
 * Selects the current sign bytes request, or null if none exists.
 * @returns {IClientRequest<Arc0013SignBytesRequestMessage> | null} the current sign bytes request or null if it does not exist.
 */
export default function useSelectSignBytesRequest(): IClientRequest<Arc0013SignBytesRequestMessage> | null {
  return useSelector<
    IMainRootState,
    IClientRequest<Arc0013SignBytesRequestMessage> | null
  >((state) => state.events.signBytesRequest);
}

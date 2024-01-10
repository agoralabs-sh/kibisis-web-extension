import { useSelector } from 'react-redux';

// messages
import { Arc0013SignTxnsRequestMessage } from '@common/messages';

// types
import { IClientRequest, IMainRootState } from '@extension/types';

/**
 * Selects the current sign transaction request, or null if none exists.
 * @returns {IClientRequest<Arc0013SignTxnsRequestMessage> | null} the current sign transaction request or null if it does not exist.
 */
export default function useSelectSignTxnsRequest(): IClientRequest<Arc0013SignTxnsRequestMessage> | null {
  return useSelector<
    IMainRootState,
    IClientRequest<Arc0013SignTxnsRequestMessage> | null
  >((state) => state.events.signTxnsRequest);
}

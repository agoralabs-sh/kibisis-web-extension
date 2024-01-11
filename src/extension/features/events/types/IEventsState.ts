// messages
import {
  Arc0013EnableRequestMessage,
  Arc0013SignBytesRequestMessage,
  Arc0013SignTxnsRequestMessage,
} from '@common/messages';

// types
import { IClientRequest } from '@extension/types';

/**
 * @property {boolean} fetching - true when accounts are being fetched from storage or remote account information is
 * being fetched.
 * @property {IClientRequest<Arc0013EnableRequestMessage> | null} enableRequest -  an enable request sent from the web page.
 * @property {IClientRequest<Arc0013SignBytesRequestMessage> | null} signBytesRequest -  a sign bytes request sent from the web page.
 * @property {IClientRequest<Arc0013EnableRequestMessage> | null} signTxnsRequest -  a sign txns request sent from the web page.
 */
interface IEventsState {
  enableRequest: IClientRequest<Arc0013EnableRequestMessage> | null;
  signBytesRequest: IClientRequest<Arc0013SignBytesRequestMessage> | null;
  signTxnsRequest: IClientRequest<Arc0013SignTxnsRequestMessage> | null;
}

export default IEventsState;

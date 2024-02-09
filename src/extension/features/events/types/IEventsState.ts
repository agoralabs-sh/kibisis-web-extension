// messages
import {
  ARC0027EnableRequestMessage,
  ARC0027SignBytesRequestMessage,
  ARC0027SignTxnsRequestMessage,
} from '@common/messages';

// types
import { IClientRequest } from '@extension/types';

/**
 * @property {boolean} fetching - true when accounts are being fetched from storage or remote account information is
 * being fetched.
 * @property {IClientRequest<ARC0027EnableRequestMessage> | null} enableRequest -  an enable request sent from the web page.
 * @property {IClientRequest<ARC0027SignBytesRequestMessage> | null} signBytesRequest -  a sign bytes request sent from the web page.
 * @property {IClientRequest<ARC0027EnableRequestMessage> | null} signTxnsRequest -  a sign txns request sent from the web page.
 */
interface IEventsState {
  enableRequest: IClientRequest<ARC0027EnableRequestMessage> | null;
  signBytesRequest: IClientRequest<ARC0027SignBytesRequestMessage> | null;
  signTxnsRequest: IClientRequest<ARC0027SignTxnsRequestMessage> | null;
}

export default IEventsState;

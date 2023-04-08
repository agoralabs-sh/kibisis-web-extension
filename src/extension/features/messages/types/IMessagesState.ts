// Types
import { IEnableRequest, ISignBytesRequest } from '@extension/types';

/**
 * @property {boolean} fetching - true when accounts are being fetched from storage or remote account information is
 * being fetched.
 * @property {IEnableRequest | null} enableRequest -  an enable request sent from the web page.
 * @property {ISignBytesRequest | null} signBytesRequest -  a sign bytes request sent from the web page.
 */
interface IMessagesState {
  enableRequest: IEnableRequest | null;
  signBytesRequest: ISignBytesRequest | null;
}

export default IMessagesState;

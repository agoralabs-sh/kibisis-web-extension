import type {
  IEnableParams,
  ISignMessageParams,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';

// types
import type { IClientRequestEvent } from '@extension/types';

/**
 * @property {boolean} fetching - true when accounts are being fetched from storage or remote account information is
 * being fetched.
 * @property {IClientRequestEvent<IEnableParams> | null} enableRequest -  an enable request sent from the client.
 * @property {IClientRequestEvent<ISignMessageParams> | null} signMessageRequest -  a sign message
 * request sent from the client.
 * @property {IClientRequestEvent<ISignTransactionsParams> | null} signTransactionsRequest -  a sign transactions
 * request sent from the client.
 */
interface IState {
  enableRequest: IClientRequestEvent<IEnableParams> | null;
  signMessageRequest: IClientRequestEvent<ISignMessageParams> | null;
  signTransactionsRequest: IClientRequestEvent<ISignTransactionsParams> | null;
}

export default IState;

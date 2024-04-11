import type {
  IEnableParams,
  ISignTransactionsParams,
} from '@agoralabs-sh/avm-web-provider';

// types
import type { IClientRequestEventPayload, IEvent } from '@extension/types';

/**
 * @property {boolean} fetching - true when accounts are being fetched from storage or remote account information is
 * being fetched.
 * @property {IEvent<IClientRequestEventPayload<IEnableParams>> | null} enableRequest -  an enable request sent from the client.
 * @property {IEvent<IClientRequestEventPayload<ISignTransactionsParams>> | null} signTransactionsRequest -  a sign transactions
 * request sent from the client.
 */
interface IState {
  enableRequest: IEvent<IClientRequestEventPayload<IEnableParams>> | null;
  signTransactionsRequest: IEvent<
    IClientRequestEventPayload<ISignTransactionsParams>
  > | null;
}

export default IState;

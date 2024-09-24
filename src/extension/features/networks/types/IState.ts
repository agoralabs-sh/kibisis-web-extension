// types
import type { INetworkWithTransactionParams } from '@extension/types';

/**
 * @property {boolean} fetching - true when fetching transaction params from storage.
 * @property {INetworkWithTransactionParams[]} items - the network with transaction params items.
 * @property {number | null} pollingId - id of the polling interval.
 * @property {boolean} saving - true when the transaction params are being saved to storage.
 * @property {boolean} updating - true when updating transaction params for the selected network.
 */
interface IState {
  fetching: boolean;
  items: INetworkWithTransactionParams[];
  pollingId: number | null;
  saving: boolean;
  updating: boolean;
}

export default IState;

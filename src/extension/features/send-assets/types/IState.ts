// types
import type { IAssetTypes, INativeCurrency } from '@extension/types';

/**
 * @property {string} amountInStandardUnits - the amount, in standard units, to send. Defaults to "0".
 * @property {boolean} confirming - confirming the transaction to the network.
 * @property {boolean} creating - true, when building the transactions.
 * @property {string | null} fromAddress - the address to send from.
 * @property {string | null} note - the note to send.
 * @property {IAssetTypes | INativeCurrency | null} selectedAsset - the selected asset to send.
 * @property {string | null} toAddress - the address to send to.
 */
interface IState {
  amountInStandardUnits: string;
  confirming: boolean;
  creating: boolean;
  fromAddress: string | null;
  note: string | null;
  selectedAsset: IAssetTypes | INativeCurrency | null;
  toAddress: string | null;
}

export default IState;

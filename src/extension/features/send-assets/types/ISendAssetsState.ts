// types
import { IArc200Asset, IStandardAsset } from '@extension/types';

/**
 * @property {string} amountInStandardUnits - the amount, in standard units, to send. Defaults to "0".
 * @property {boolean} confirming - confirming the transaction to the network.
 * @property {string | null} fromAddress - the address to send from.
 * @property {string | null} note - the note to send.
 * @property {IArc200Asset | IStandardAsset | null} selectedAsset - the selected asset to send.
 * @property {string | null} toAddress - the address to send to.
 */
interface ISendAssetsState {
  amountInStandardUnits: string;
  confirming: boolean;
  fromAddress: string | null;
  note: string | null;
  selectedAsset: IArc200Asset | IStandardAsset | null;
  toAddress: string | null;
}

export default ISendAssetsState;

// errors
import { BaseExtensionError } from '@extension/errors';

// types
import { IAsset } from '@extension/types';

/**
 * @property {string} amount - the amount to send. Default is "0".
 * @property {boolean} confirming - confirming the transaction to the network.
 * @property {BaseExtensionError | null} error - if an error occurred.
 * @property {string | null} fromAddress - the address to send from.
 * @property {string | null} note - the note to send.
 * @property {IAsset | null} selectedAsset - the selected asset to send.
 * @property {string | null} toAddress - the address to send to.
 */
interface ISendAssetsState {
  amount: string;
  confirming: boolean;
  error: BaseExtensionError | null;
  fromAddress: string | null;
  note: string | null;
  selectedAsset: IAsset | null;
  toAddress: string | null;
}

export default ISendAssetsState;

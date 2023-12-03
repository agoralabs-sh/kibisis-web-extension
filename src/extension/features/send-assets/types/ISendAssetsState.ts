// types
import { IAsset } from '@extension/types';

/**
 * @property {string | null} amount - the amount to send.
 * @property {string | null} fromAddress - the address to send from.
 * @property {string | null} note - the note to send.
 * @property {IAsset | null} selectedAsset - the selected asset to send.
 * @property {string | null} toAddress - the address to send to.
 */
interface ISendAssetsState {
  amount: string | null;
  fromAddress: string | null;
  note: string | null;
  selectedAsset: IAsset | null;
  toAddress: string | null;
}

export default ISendAssetsState;

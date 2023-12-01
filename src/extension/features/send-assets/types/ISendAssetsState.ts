// types
import { IAsset } from '@extension/types';

/**
 * @property {string | null} fromAddress - the address to send from.
 * @property {IAsset | null} selectedAsset - the selected asset to send.
 */
interface ISendAssetsState {
  fromAddress: string | null;
  selectedAsset: IAsset | null;
}

export default ISendAssetsState;

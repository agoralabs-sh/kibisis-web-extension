// types
import { IAsset } from '@extension/types';

/**
 * @property {IAsset | null} selectedAsset - the selected asset to send.
 */
interface ISendAssetsState {
  selectedAsset: IAsset | null;
}

export default ISendAssetsState;

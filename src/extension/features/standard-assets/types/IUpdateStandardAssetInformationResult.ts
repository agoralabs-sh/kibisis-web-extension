// types
import { IAsset, INetwork } from '@extension/types';

/**
 * @property {IAsset[]} standardAssets - the updated standard assets.
 * @property {INetwork} network - the network.
 */
interface IUpdateStandardAssetInformationResult {
  network: INetwork;
  standardAssets: IAsset[];
}

export default IUpdateStandardAssetInformationResult;

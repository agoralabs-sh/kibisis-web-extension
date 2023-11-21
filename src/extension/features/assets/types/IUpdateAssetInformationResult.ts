// types
import { IAsset } from '@extension/types';

/**
 * @property {string} encodedGenesisHash - the hex encoded genesis hash of the network.
 * @property {IAsset[]} assets - the updated assets.
 */
interface IUpdateAssetInformationResult {
  assets: IAsset[];
  encodedGenesisHash: string;
}

export default IUpdateAssetInformationResult;

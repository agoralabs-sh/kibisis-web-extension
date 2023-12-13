// types
import { IArc200Asset, INetwork } from '@extension/types';

/**
 * @property {IArc200Asset[]} arc200Assets - the updated ARC200 assets.
 * @property {INetwork} network - the network.
 */
interface IUpdateArc200AssetInformationResult {
  arc200Assets: IArc200Asset[];
  network: INetwork;
}

export default IUpdateArc200AssetInformationResult;

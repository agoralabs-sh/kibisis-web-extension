// types
import { IARC0200Asset, INetwork } from '@extension/types';

/**
 * @property {IArc200Asset[]} arc200Assets - the updated ARC200 assets.
 * @property {INetwork} network - the network.
 */
interface IUpdateARC0200AssetInformationResult {
  arc200Assets: IARC0200Asset[];
  network: INetwork;
}

export default IUpdateARC0200AssetInformationResult;

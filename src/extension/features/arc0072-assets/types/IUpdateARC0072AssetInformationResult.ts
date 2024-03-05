// types
import type { IARC0072Asset, INetwork } from '@extension/types';

/**
 * @property {IARC0072Asset[]} arc0072Assets - the updated ARC-0072 assets.
 * @property {INetwork} network - the network.
 */
interface IUpdateARC0072AssetInformationResult {
  arc0072Assets: IARC0072Asset[];
  network: INetwork;
}

export default IUpdateARC0072AssetInformationResult;

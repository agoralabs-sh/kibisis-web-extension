import { INetwork } from '@extension/types';

/**
 * @property {string[]} ids - the ID of the standard assets to fetch information for.
 * @property {INetwork} network - the network to fetch assets from.
 */
interface IUpdateStandardAssetInformationPayload {
  ids: string[];
  network: INetwork;
}

export default IUpdateStandardAssetInformationPayload;

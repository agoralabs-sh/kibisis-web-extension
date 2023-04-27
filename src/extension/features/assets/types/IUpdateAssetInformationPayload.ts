import { INetwork } from '@extension/types';

/**
 * @property {string[]} ids - the ID of the assets to fetch information for.
 * @property {INetwork} network - the network to fetch assets from.
 */
interface IUpdateAssetInformationPayload {
  ids: string[];
  network: INetwork;
}

export default IUpdateAssetInformationPayload;

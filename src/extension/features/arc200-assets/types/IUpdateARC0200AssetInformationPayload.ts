import { INetwork } from '@extension/types';

/**
 * @property {string[]} ids - the app IDs of the ARC200 assets to fetch information for.
 * @property {INetwork} network - the network to fetch the ARC200 assets from.
 */
interface IUpdateARC0200AssetInformationPayload {
  ids: string[];
  network: INetwork;
}

export default IUpdateARC0200AssetInformationPayload;

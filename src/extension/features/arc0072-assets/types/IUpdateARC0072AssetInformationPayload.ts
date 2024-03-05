// types
import type { INetwork } from '@extension/types';

/**
 * @property {string[]} ids - the app IDs of the ARC-0072 assets to fetch information for.
 * @property {INetwork} network - the network to fetch the ARC-0072 assets from.
 */
interface IUpdateARC0072AssetInformationPayload {
  ids: string[];
  network: INetwork;
}

export default IUpdateARC0072AssetInformationPayload;

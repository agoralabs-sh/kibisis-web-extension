import { Algodv2 } from 'algosdk';

// types
import type { INetwork, INode } from '@extension/types';

// utils
import getRandomItem from '@common/utils/getRandomItem';

/**
 * Gets a random algod node from the given network.
 * @param {INetwork} network - the network to choose the node from.
 * @returns {Algodv2} an initialized algod client.
 */
export default function createAlgodClient(network: INetwork): Algodv2 {
  const algod = getRandomItem<INode>(network.algods);

  return new Algodv2('', algod.url, algod.port);
}

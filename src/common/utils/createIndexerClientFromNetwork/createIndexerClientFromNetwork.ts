import { Indexer } from 'algosdk';

// types
import type { INetwork, INode } from '@extension/types';

// utils
import getRandomItem from '@common/utils/getRandomItem';

/**
 * Gets a random indexer node from the given network.
 * @param {INetwork} network - the network to choose the node from.
 * @returns {Indexer} an initialized indexer client.
 */
export default function createIndexerClientFromNetwork(
  network: INetwork
): Indexer {
  const indexer = getRandomItem<INode>(network.indexers);

  return new Indexer('', indexer.url, indexer.port);
}

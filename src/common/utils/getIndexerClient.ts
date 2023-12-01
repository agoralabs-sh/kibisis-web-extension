import { Indexer } from 'algosdk';

// types
import { IBaseOptions } from '@common/types';
import { INetwork, INode } from '@extension/types';

// utils
import getRandomNode from './getRandomNode';

/**
 * Gets a random indexer node from the given network.
 * @param {INetwork} network - the network to choose the node from.
 * @param {IBaseOptions} options - [optional] various options such as logger.
 * @returns {Indexer} an initialized indexer client.
 */
export default function getIndexerClient(
  network: INetwork,
  { logger }: IBaseOptions = { logger: undefined }
): Indexer {
  const indexer: INode = getRandomNode(network.indexers);

  logger &&
    logger.debug(
      `${getIndexerClient.name}(): selected indexer node "${indexer.canonicalName}"`
    );

  return new Indexer('', indexer.url, indexer.port);
}

import { Algodv2 } from 'algosdk';

// types
import { IBaseOptions } from '@common/types';
import { INetwork, INode } from '@extension/types';

// utils
import getRandomNode from '../getRandomNode';

/**
 * Gets a random algod node from the given network.
 * @param {INetwork} network - the network to choose the node from.
 * @param {IBaseOptions} options - [optional] various options such as logger.
 * @returns {Algodv2} an initialized algod client.
 */
export default function getAlgodClient(
  network: INetwork,
  { logger }: IBaseOptions = { logger: undefined }
): Algodv2 {
  const algod: INode = getRandomNode(network.algods);

  logger &&
    logger.debug(
      `${getAlgodClient.name}(): selected algod node "${algod.canonicalName}"`
    );

  return new Algodv2('', algod.url, algod.port);
}

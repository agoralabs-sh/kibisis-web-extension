import { Algodv2 } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';
import type { INetwork, INode } from '@extension/types';

// utils
import getRandomItem from '@common/utils/getRandomItem';

/**
 * Gets a random algod node from the given network.
 * @param {INetwork} network - the network to choose the node from.
 * @param {IBaseOptions} options - [optional] various options such as logger.
 * @returns {Algodv2} an initialized algod client.
 */
export default function createAlgodClient(
  network: INetwork,
  { logger }: IBaseOptions = { logger: undefined }
): Algodv2 {
  const _functionName: string = 'createAlgodClient';
  const algod: INode = getRandomItem<INode>(network.algods);

  logger?.debug(
    `${_functionName}: selected algod node "${algod.canonicalName}"`
  );

  return new Algodv2('', algod.url, algod.port);
}

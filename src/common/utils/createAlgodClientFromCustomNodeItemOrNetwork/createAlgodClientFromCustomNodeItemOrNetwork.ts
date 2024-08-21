import { Algodv2 } from 'algosdk';

// types
import type { INode, TCustomNodeItemOrNetwork } from '@extension/types';
import type { IOptions } from './types';

// utils
import getRandomItem from '@common/utils/getRandomItem';

/**
 * If a custom node is selected in the settings, this is used, otherwise, the selected network genesis hash is used. If
 * the selected network genesis hash is not in the list of networks, the fallback network is used.
 * @param {TCustomNodeItemOrNetwork} value - a custom nodes, the networks, the settings and a fallback network.
 * @returns {Algodv2} an initialized algod client.
 */
export default function createAlgodClientFromCustomNodeItemOrNetwork(
  value: TCustomNodeItemOrNetwork
): Algodv2 {
  let node: INode;

  if (value.discriminator === 'ICustomNodeItem') {
    return new Algodv2(
      value.algod.token || '',
      value.algod.url,
      value.algod.port
    );
  }

  node = getRandomItem<INode>(value.algods);

  return new Algodv2(node.token || '', node.url, node.port);
}

// Types
import { INetwork, INode } from '@extension/types';

// Utils
import { randomNode } from '@common/utils';

/**
 * Gets a random node that is NOT PureStake, because Puretake do not allow localhost :*(
 * @param {INetwork} network - the network to get the nodes from.
 * @returns {INode} a random node that is not PureStake.
 */
export default function randomNotPureStakeNode(network: INetwork): INode {
  let node: INode = randomNode(network);

  while (node.name === 'PureStake') {
    node = randomNode(network);
  }

  return node;
}

import { INetwork, INode } from '@extension/types';

/**
 * Picks a random node from the network.
 * @param {INetwork} network - the network.
 * @returns {INode} a random node.
 */
export default function randomNode(network: INetwork): INode {
  return network.nodes[Math.floor(Math.random() * network.nodes.length)];
}

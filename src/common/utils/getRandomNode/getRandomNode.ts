// types
import { INode } from '@extension/types';

/**
 * Convenience function that randomly picks a node from a list.
 * @param {INode[]} nodes - a list of nodes.
 * @returns {INode} a random node from the list.
 */
export default function getRandomNode(nodes: INode[]): INode {
  return nodes[Math.floor(Math.random() * nodes.length)];
}

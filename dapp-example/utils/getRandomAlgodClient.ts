import { Algodv2 } from 'algosdk';

// types
import { INetwork, INode } from '@extension/types';

/**
 * Gets an initialized algod client.
 * @param {INetwork} network - the network to get the nodes from.
 * @returns {Algodv2} an initialized algod client.
 */
export default function getAlgodClient(network: INetwork): Algodv2 {
  const node: INode | null =
    network.algods[Math.floor(Math.random() * network.algods.length)];

  if (!node) {
    throw new Error(`no node found for network "${network.genesisId}"`);
  }

  return new Algodv2('', node.url, node.port || '');
}

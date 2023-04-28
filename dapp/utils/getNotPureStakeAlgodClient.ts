import { Algodv2 } from 'algosdk';

// Types
import { INetwork, INode } from '@extension/types';

/**
 * Gets an initialized algod client that is NOT PureStake, because PureStake do not allow localhost :*(
 * @param {INetwork} network - the network to get the nodes from.
 * @returns {Algodv2} an initialized algod client that is not PureStake.
 */
export default function getNotPureStakeAlgodClient(network: INetwork): Algodv2 {
  let node: INode | null = null;

  while (!node || node.canonicalName === 'PureStake') {
    node = network.algods[Math.floor(Math.random() * network.algods.length)];
  }

  return new Algodv2('', node.url, node.port);
}

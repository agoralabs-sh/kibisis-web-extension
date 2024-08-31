import type { SessionTypes } from '@walletconnect/types';

// types
import type { INetwork } from '@extension/types';

/**
 * Extracts the WalletConnect namespace from the network.
 * @param {INetwork} network - the network to extract the namespace from.
 * @returns {SessionTypes.BaseNamespace} the WalletConnect namespace.
 */
export default function extractWalletConnectNamespaceFromNetwork(
  network: INetwork
): SessionTypes.BaseNamespace {
  return {
    accounts: [],
    chains: [`${network.namespace.key}:${network.namespace.reference}`],
    events: [],
    methods: network.namespace.methods,
  };
}

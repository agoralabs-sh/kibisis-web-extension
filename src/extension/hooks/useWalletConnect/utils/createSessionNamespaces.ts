import { ProposalTypes, SessionTypes } from '@walletconnect/types';
import { buildApprovedNamespaces } from '@walletconnect/utils';

// Types
import { INetwork } from '@extension/types';

interface IOptions {
  authorizedAddresses: string[];
  network: INetwork;
  proposalParams: ProposalTypes.Struct;
}

export default function createSessionNamespaces({
  authorizedAddresses,
  network,
  proposalParams,
}: IOptions): SessionTypes.Namespaces {
  const chainId: string = `${network.namespace.key}:${network.namespace.reference}`; // in CAIP-2 format e.g. ['algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe']

  return buildApprovedNamespaces({
    proposal: proposalParams,
    supportedNamespaces: {
      algorand: {
        accounts: authorizedAddresses.map((value) => `${chainId}:${value}`), // accounts that comply with the CAIP-10 format e.g. ['algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe:ULDXF5B7ZJFIKUY25RFE7EIBV3CS47FZLZDCJHUHQFRSX74L5S6V75M4NE']
        chains: [chainId],
        events: [],
        methods: network.namespace.methods.map(
          (value) => `${network.namespace.key}_${value}`
        ),
      },
    },
  });
}

import { ProposalTypes, SessionTypes } from '@walletconnect/types';
import { buildApprovedNamespaces } from '@walletconnect/utils';

// Config
import {
  walletConnectSupportedChains as chains,
  walletConnectSupportedMethods as methods,
} from '@extension/config';

interface IOptions {
  addresses: string[];
  proposalParams: ProposalTypes.Struct;
}

export default function createSessionNamespaces({
  addresses,
  proposalParams,
}: IOptions): SessionTypes.Namespaces {
  return buildApprovedNamespaces({
    proposal: proposalParams,
    supportedNamespaces: {
      algorand: {
        accounts: chains.reduce<string[]>(
          (acc, chain) => [
            ...acc,
            ...addresses.map((address) => `${chain}:${address}`),
          ],
          []
        ), // accounts that comply with the CAIP-10 format e.g. ['algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe:ULDXF5B7ZJFIKUY25RFE7EIBV3CS47FZLZDCJHUHQFRSX74L5S6V75M4NE']
        chains,
        events: [],
        methods,
      },
    },
  });
}

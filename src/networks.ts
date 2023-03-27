// Types
import { INetwork } from './types';

const networks: INetwork[] = [
  // default is position 0 (algorand mainnet)
  {
    genesisId: 'mainnet-v1.0',
    genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
    nativeCurrency: {
      code: 'ALGO',
      decimals: 6,
    },
    nodes: [
      {
        name: 'AlgoExplorer',
        port: '',
        url: 'https://node.algoexplorerapi.io',
      },
      {
        name: 'AlgoNode',
        port: '',
        url: 'https://mainnet-api.algonode.cloud',
      },
    ],
  },
  {
    genesisId: 'betanet-v1.0',
    genesisHash: 'mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0=',
    nativeCurrency: {
      code: 'ALGO',
      decimals: 6,
    },
    nodes: [
      {
        name: 'AlgoExplorer',
        port: '',
        url: 'https://node.betanet.algoexplorerapi.io',
      },
      {
        name: 'AlgoNode',
        port: '',
        url: 'https://betanet-api.algonode.cloud',
      },
    ],
  },
  {
    genesisId: 'testnet-v1.0',
    genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
    nativeCurrency: {
      code: 'ALGO',
      decimals: 6,
    },
    nodes: [
      {
        name: 'AlgoExplorer',
        port: '',
        url: 'https://node.testnet.algoexplorerapi.io',
      },
      {
        name: 'AlgoNode',
        port: '',
        url: 'https://testnet-api.algonode.cloud',
      },
    ],
  },
];

export default networks;

// constants
import { SUPPORTED_METHODS } from '@common/constants';
import {
  ALGORAND_ICON_URI,
  ALGORAND_LISTING_ICON_URI,
  VOI_ICON_URI,
  VOI_LISTING_ICON_URI,
} from '@extension/constants';

// enums
import { AssetTypeEnum, NetworkTypeEnum } from '@extension/enums';

// models
import AlloBlockExplorer from '@extension/models/AlloBlockExplorer';
import AVMExplorerBlockExplorer from '@extension/models/AVMExplorerBlockExplorer';
import NautilusARC0072Indexer from '@extension/models/NautilusARC0072Indexer';
import NFTNavigatorARC0072Indexer from '@extension/models/NFTNavigatorARC0072Indexer';
import NFTNavigatorNFTExplorer from '@extension/models/NFTNavigatorNFTExplorer';
import PeraBlockExplorer from '@extension/models/PeraBlockExplorer';
import VoiObserverBlockExplorer from '@extension/models/VoiObserverBlockExplorer';

// types
import type { INetwork } from '@extension/types';

const networks: INetwork[] = [
  /**
   * voi networks
   */
  {
    algods: [
      {
        canonicalName: 'Nodely',
        id: null,
        port: null,
        token: null,
        url: 'https://mainnet-api.voi.nodely.dev',
      },
    ],
    arc0072Indexers: [
      new NautilusARC0072Indexer({
        baseURL: 'https://mainnet-idx.nautilus.sh',
      }),
      new NFTNavigatorARC0072Indexer({
        baseURL: 'https://arc72-voi-mainnet.nftnavigator.xyz',
      }),
    ],
    canonicalName: 'Voi',
    chakraTheme: 'voi',
    blockExplorers: [
      new VoiObserverBlockExplorer({
        baseURL: 'https://explorer.voi.network/explorer',
        canonicalName: 'Voi Network',
        id: 'voi-network',
      }),
    ],
    feeSunkAddress:
      'TBEIGCNK4UCN3YDP2NODK3MJHTUZMYS3TABRM2MVSI2MPUR2V36E5JYHSY',
    genesisId: 'voimain-v1.0',
    genesisHash: 'r20fSQI8gWe/kFZziNonSPCXLwcQmH/nxROvnnueWOk=',
    hdWalletCoinType: 723,
    indexers: [
      {
        canonicalName: 'Nodely',
        id: null,
        port: null,
        token: null,
        url: 'https://mainnet-idx.voi.nodely.dev',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'avm',
      methods: ['avm_signTransactions', 'avm_signMessage'],
      reference: 'r20fSQI8gWe_kFZziNonSPCXLwcQmH_n',
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: VOI_ICON_URI,
      listingUri: VOI_LISTING_ICON_URI,
      symbol: 'VOI',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [
      new NFTNavigatorNFTExplorer({
        baseURL: 'https://nftnavigator.xyz',
      }),
    ],
    type: NetworkTypeEnum.Stable,
  },
  {
    algods: [
      {
        canonicalName: 'Nodely',
        id: null,
        port: null,
        token: null,
        url: 'https://testnet-api.voi.nodly.io',
      },
    ],
    arc0072Indexers: [
      new NautilusARC0072Indexer({
        baseURL: 'https://arc72-idx.nautilus.sh',
      }),
      new NFTNavigatorARC0072Indexer({
        baseURL: 'https://arc72-idx.nftnavigator.xyz',
      }),
    ],
    canonicalName: 'Voi',
    chakraTheme: 'voi',
    blockExplorers: [
      new VoiObserverBlockExplorer({
        baseURL: 'https://voi.observer/explorer',
      }),
      new AVMExplorerBlockExplorer({
        baseURL: 'https://avmexplorer.com',
      }),
    ],
    feeSunkAddress:
      'FEES3ZW52HQ7U7LB3OGLUFQX2DCCWPJ2LIMXAH75KYROBZBQRN3Q5OR3GI',
    genesisId: 'voitest-v1',
    genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
    hdWalletCoinType: 723,
    indexers: [
      {
        canonicalName: 'Nodely',
        id: null,
        port: null,
        token: null,
        url: 'https://testnet-idx.voi.nodly.io',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'avm',
      methods: ['avm_signTransactions', 'avm_signMessage'],
      reference: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXu',
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: VOI_ICON_URI,
      listingUri: VOI_LISTING_ICON_URI,
      symbol: 'VOI',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [
      new NFTNavigatorNFTExplorer({
        baseURL: 'https://arc72-idx.nftnavigator.xyz',
      }),
    ],
    type: NetworkTypeEnum.Test,
  },
  /**
   * algorand networks
   */
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://mainnet-api.algonode.cloud',
      },
    ],
    arc0072Indexers: [],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    blockExplorers: [
      new PeraBlockExplorer({
        baseURL: 'https://explorer.perawallet.app',
      }),
      new AlloBlockExplorer({
        baseURL: 'https://allo.info',
      }),
    ],
    feeSunkAddress:
      'Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA',
    genesisId: 'mainnet-v1.0',
    genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
    hdWalletCoinType: 283,
    indexers: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://mainnet-idx.algonode.cloud',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'algorand',
      methods: ['algo_signTxn'],
      reference: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73k',
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: ALGORAND_ICON_URI,
      listingUri: ALGORAND_LISTING_ICON_URI,
      symbol: 'ALGO',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [],
    type: NetworkTypeEnum.Stable,
  },
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://betanet-api.algonode.cloud',
      },
    ],
    arc0072Indexers: [],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    blockExplorers: [],
    feeSunkAddress:
      'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE',
    genesisId: 'betanet-v1.0',
    genesisHash: 'mFgazF+2uRS1tMiL9dsj01hJGySEmPN28B/TjjvpVW0=',
    hdWalletCoinType: 283,
    indexers: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://betanet-idx.algonode.cloud',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'algorand',
      methods: ['algo_signTxn'],
      reference: 'mFgazF-2uRS1tMiL9dsj01hJGySEmPN2',
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: ALGORAND_ICON_URI,
      listingUri: ALGORAND_LISTING_ICON_URI,
      symbol: 'ALGO',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [],
    type: NetworkTypeEnum.Beta,
  },
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://testnet-api.algonode.cloud',
      },
    ],
    arc0072Indexers: [],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    blockExplorers: [
      new PeraBlockExplorer({
        baseURL: 'https://testnet.explorer.perawallet.app',
      }),
    ],
    feeSunkAddress:
      'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE',
    genesisId: 'testnet-v1.0',
    genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
    hdWalletCoinType: 283,
    indexers: [
      {
        canonicalName: 'AlgoNode',
        id: null,
        port: null,
        token: null,
        url: 'https://testnet-idx.algonode.cloud',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'algorand',
      methods: ['algo_signTxn'],
      reference: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe',
    },
    nativeCurrency: {
      decimals: 6,
      iconUrl: ALGORAND_ICON_URI,
      listingUri: ALGORAND_LISTING_ICON_URI,
      symbol: 'ALGO',
      type: AssetTypeEnum.Native,
      verified: true,
    },
    nftExplorers: [],
    type: NetworkTypeEnum.Test,
  },
];

export default networks;

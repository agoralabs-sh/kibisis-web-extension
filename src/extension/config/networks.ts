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
import NautilusARC0072Indexer from '@extension/models/NautilusARC0072Indexer';
import NFTNavigatorARC0072Indexer from '@extension/models/NFTNavigatorARC0072Indexer';
import NFTNavigatorNFTExplorer from '@extension/models/NFTNavigatorNFTExplorer';

// types
import type { INetwork } from '@extension/types';

const networks: INetwork[] = [
  /**
   * voi networks
   */
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://testnet-api.voi.nodly.io',
      },
    ],
    arc0072Indexers: [
      new NautilusARC0072Indexer(),
      new NFTNavigatorARC0072Indexer(),
    ],
    canonicalName: 'Voi',
    chakraTheme: 'voi',
    blockExplorers: [
      {
        accountPath: '/account',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://voi.observer/explorer',
        blockPath: '/block',
        canonicalName: 'Voi Observer',
        groupPath: '/group',
        id: 'voi-observer',
        transactionPath: '/transaction',
      },
    ],
    feeSunkAddress:
      'FEES3ZW52HQ7U7LB3OGLUFQX2DCCWPJ2LIMXAH75KYROBZBQRN3Q5OR3GI',
    genesisId: 'voitest-v1',
    genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://testnet-idx.voi.nodly.io',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'voi',
      methods: ['signTransaction', 'signMessage'],
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
    nftExplorers: [new NFTNavigatorNFTExplorer()],
    type: NetworkTypeEnum.Test,
  },
  /**
   * algorand networks
   */
  {
    algods: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://mainnet-api.algonode.cloud',
      },
    ],
    arc0072Indexers: [],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    blockExplorers: [
      {
        accountPath: '/address',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://explorer.perawallet.app',
        blockPath: '/block',
        canonicalName: 'Pera Explorer',
        groupPath: '/tx-group',
        id: 'pera',
        transactionPath: '/tx',
      },
      {
        accountPath: '/account',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://allo.info',
        blockPath: '/block',
        canonicalName: 'Allo',
        groupPath: '/tx/group',
        id: 'allo',
        transactionPath: '/tx',
      },
    ],
    feeSunkAddress:
      'Y76M3MSY6DKBRHBL7C3NNDXGS5IIMQVQVUAB6MP4XEMMGVF2QWNPL226CA',
    genesisId: 'mainnet-v1.0',
    genesisHash: 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://mainnet-idx.algonode.cloud',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'algorand',
      methods: ['signTransaction', 'signMessage'],
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
        port: '',
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
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://betanet-idx.algonode.cloud',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'algorand',
      methods: ['signTransaction', 'signMessage'],
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
        port: '',
        url: 'https://testnet-api.algonode.cloud',
      },
    ],
    arc0072Indexers: [],
    canonicalName: 'Algorand',
    chakraTheme: 'algorand',
    blockExplorers: [
      {
        accountPath: '/address',
        applicationPath: '/application',
        assetPath: '/asset',
        baseUrl: 'https://testnet.explorer.perawallet.app',
        blockPath: '/block',
        canonicalName: 'Pera Explorer',
        groupPath: '/tx-group',
        id: 'pera',
        transactionPath: '/tx',
      },
    ],
    feeSunkAddress:
      'A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE',
    genesisId: 'testnet-v1.0',
    genesisHash: 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
    indexers: [
      {
        canonicalName: 'AlgoNode',
        port: '',
        url: 'https://testnet-idx.algonode.cloud',
      },
    ],
    methods: SUPPORTED_METHODS,
    namespace: {
      key: 'algorand',
      methods: ['signTransaction', 'signMessage'],
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

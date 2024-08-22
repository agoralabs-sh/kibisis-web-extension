import { v4 as uuid } from 'uuid';

// constants
import { SUPPORTED_METHODS } from '@common/constants';
import { VOI_ICON_URI, VOI_LISTING_ICON_URI } from '@extension/constants';

// enums
import { AssetTypeEnum, NetworkTypeEnum } from '@extension/enums';

// types
import type { INetwork } from '@extension/types';

// utils
import filterCustomNodesFromNetwork from './filterCustomNodesFromNetwork';

describe('filterCustomNodesFromNetwork', () => {
  let network: INetwork;

  beforeEach(() => {
    network = {
      algods: [
        {
          canonicalName: 'AlgoNode',
          id: null,
          port: null,
          token: null,
          url: 'https://testnet-api.voi.nodly.io',
        },
      ],
      arc0072Indexers: [],
      canonicalName: 'Voi',
      chakraTheme: 'voi',
      blockExplorers: [],
      feeSunkAddress:
        'FEES3ZW52HQ7U7LB3OGLUFQX2DCCWPJ2LIMXAH75KYROBZBQRN3Q5OR3GI',
      genesisId: 'voitest-v1',
      genesisHash: 'IXnoWtviVVJW5LGivNFc0Dq14V3kqaXuK2u5OQrdVZo=',
      indexers: [
        {
          canonicalName: 'AlgoNode',
          id: null,
          port: null,
          token: null,
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
      nftExplorers: [],
      type: NetworkTypeEnum.Test,
    };
  });

  it('should return an empty array if no custom algods or indexers exist', () => {
    // arrange
    // act
    // assert
    expect(filterCustomNodesFromNetwork(network)).toEqual([]);
  });

  it('should return an empty array if no algods or indexers exist', () => {
    // arrange
    // act
    // assert
    expect(
      filterCustomNodesFromNetwork({
        ...network,
        algods: [],
        indexers: [],
      })
    ).toEqual([]);
  });

  it('should add only the algod node', () => {
    // arrange
    // act
    const result = filterCustomNodesFromNetwork({
      ...network,
      algods: [
        {
          canonicalName: 'Algod',
          id: uuid(),
          port: null,
          token: null,
          url: 'https://algod.node',
        },
      ],
    });

    // assert
    expect(result).toHaveLength(1);
    expect(result[0].algod).toBeDefined();
    expect(result[0].indexer).toBeNull();
  });

  it('should add only the indexer node', () => {
    // arrange
    // act
    const result = filterCustomNodesFromNetwork({
      ...network,
      indexers: [
        {
          canonicalName: 'Index',
          id: uuid(),
          port: null,
          token: null,
          url: 'https://indexer.node',
        },
      ],
    });

    // assert
    expect(result).toHaveLength(1);
    expect(result[0].algod).toBeNull();
    expect(result[0].indexer).toBeDefined();
  });

  it('should add both the indexer and algod node', () => {
    // arrange
    const id = uuid();
    const canonicalName = 'A Node';
    // act
    const result = filterCustomNodesFromNetwork({
      ...network,
      algods: [
        ...network.algods,
        {
          canonicalName,
          id,
          port: null,
          token: null,
          url: 'https://algod.node',
        },
      ],
      indexers: [
        ...network.indexers,
        {
          canonicalName,
          id,
          port: null,
          token: null,
          url: 'https://indexer.node',
        },
      ],
    });

    // assert
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(id);
    expect(result[0].algod).toBeDefined();
    expect(result[0].indexer).toBeDefined();
  });
});

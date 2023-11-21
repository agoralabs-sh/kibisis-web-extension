import { BigNumber } from 'bignumber.js';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import {
  IAlgorandAssetConfigTransaction,
  IAssetConfigTransaction,
  IAssetCreateTransaction,
  IAssetDestroyTransaction,
  IBaseTransaction,
} from '@extension/types';

export default function parseAssetConfigTransaction(
  algorandAssetConfigTransaction: IAlgorandAssetConfigTransaction,
  baseTransaction: IBaseTransaction
):
  | IAssetConfigTransaction
  | IAssetCreateTransaction
  | IAssetDestroyTransaction {
  // if the asset-id is zero, it is a creation
  if (algorandAssetConfigTransaction['asset-id'] <= 0) {
    return {
      ...baseTransaction,
      clawback: algorandAssetConfigTransaction.params.clawback || null,
      creator: algorandAssetConfigTransaction.params.creator,
      decimals: Number(algorandAssetConfigTransaction.params.decimals),
      defaultFrozen: algorandAssetConfigTransaction.params['default-frozen'],
      freeze: algorandAssetConfigTransaction.params.freeze || null,
      manager: algorandAssetConfigTransaction.params.manager || null,
      metadataHash:
        algorandAssetConfigTransaction.params['metadata-hash'] || null,
      name: algorandAssetConfigTransaction.params.name || null,
      reserve: algorandAssetConfigTransaction.params.reserve || null,
      total: new BigNumber(
        String(algorandAssetConfigTransaction.params.total as bigint)
      ).toString(),
      unitName: algorandAssetConfigTransaction.params['unit-name'] || null,
      url: algorandAssetConfigTransaction.params.url || null,
      type: TransactionTypeEnum.AssetCreate,
    };
  }

  // if we have the config params, this will be a config
  if (
    algorandAssetConfigTransaction.params.clawback &&
    algorandAssetConfigTransaction.params.freeze &&
    algorandAssetConfigTransaction.params.manager &&
    algorandAssetConfigTransaction.params.reserve
  ) {
    return {
      ...baseTransaction,
      assetId: new BigNumber(
        String(algorandAssetConfigTransaction['asset-id'] as bigint)
      ).toString(),
      clawback: algorandAssetConfigTransaction.params.clawback,
      creator: algorandAssetConfigTransaction.params.creator,
      decimals: Number(algorandAssetConfigTransaction.params.decimals),
      defaultFrozen: algorandAssetConfigTransaction.params['default-frozen'],
      freeze: algorandAssetConfigTransaction.params.freeze,
      manager: algorandAssetConfigTransaction.params.manager,
      reserve: algorandAssetConfigTransaction.params.reserve,
      total: new BigNumber(
        String(algorandAssetConfigTransaction.params.total as bigint)
      ).toString(),
      type: TransactionTypeEnum.AssetConfig,
    };
  }

  return {
    ...baseTransaction,
    assetId: new BigNumber(
      String(algorandAssetConfigTransaction['asset-id'] as bigint)
    ).toString(),
    creator: algorandAssetConfigTransaction.params.creator,
    decimals: Number(algorandAssetConfigTransaction.params.decimals),
    defaultFrozen: algorandAssetConfigTransaction.params['default-frozen'],
    total: new BigNumber(
      String(algorandAssetConfigTransaction.params.total as bigint)
    ).toString(),
    type: TransactionTypeEnum.AssetDestroy,
  };
}

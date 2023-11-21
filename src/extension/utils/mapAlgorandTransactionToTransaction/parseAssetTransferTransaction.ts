import { BigNumber } from 'bignumber.js';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import {
  IBaseTransaction,
  IAlgorandAssetTransferTransaction,
  IAssetTransferTransaction,
} from '@extension/types';

export default function parseAssetTransferTransaction(
  algorandAssetTransferTransaction: IAlgorandAssetTransferTransaction,
  baseTransaction: IBaseTransaction
): IAssetTransferTransaction {
  return {
    ...baseTransaction,
    amount: new BigNumber(
      String(algorandAssetTransferTransaction.amount as bigint)
    ).toString(),
    assetId: new BigNumber(
      String(algorandAssetTransferTransaction['asset-id'] as bigint)
    ).toString(),
    receiver: algorandAssetTransferTransaction.receiver,
    type: TransactionTypeEnum.AssetTransfer,
  };
}

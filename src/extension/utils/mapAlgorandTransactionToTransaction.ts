import { BigNumber } from 'bignumber.js';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import {
  IAlgorandTransaction,
  IBaseTransaction,
  ITransactions,
} from '@extension/types';

export default function mapAlgorandTransactionToTransaction(
  algorandTransaction: IAlgorandTransaction
): ITransactions {
  const baseTransaction: IBaseTransaction = {
    fee: new BigNumber(String(algorandTransaction.fee as bigint)).toString(),
    id: algorandTransaction.id || null,
    groupId: algorandTransaction.group || null,
    note: algorandTransaction.note || null,
    sender: algorandTransaction.sender,
  };

  switch (algorandTransaction['tx-type']) {
    case 'acfg':
      return {
        ...baseTransaction,
        assetId: new BigNumber(
          String(
            algorandTransaction['asset-config-transaction'][
              'asset-id'
            ] as bigint
          )
        ).toString(),
        type: TransactionTypeEnum.AssetConfig,
      };
    case 'appl':
      if (
        algorandTransaction['application-transaction']['on-completion'] ===
        'noop'
      ) {
        return {
          ...baseTransaction,
          applicationId: new BigNumber(
            String(
              algorandTransaction['application-transaction'][
                'application-id'
              ] as bigint
            )
          ).toString(),
          type: TransactionTypeEnum.ApplicationNoOp,
        };
      }

      break;
    case 'axfer':
      return {
        ...baseTransaction,
        amount: new BigNumber(
          String(
            algorandTransaction['asset-transfer-transaction'].amount as bigint
          )
        ).toString(),
        assetId: new BigNumber(
          String(
            algorandTransaction['asset-transfer-transaction'][
              'asset-id'
            ] as bigint
          )
        ).toString(),
        receiver: algorandTransaction['asset-transfer-transaction'].receiver,
        type: TransactionTypeEnum.AssetTransfer,
      };
    case 'pay':
      return {
        ...baseTransaction,
        amount: new BigNumber(
          String(algorandTransaction['payment-transaction'].amount as bigint)
        ).toString(),
        receiver: algorandTransaction['payment-transaction'].receiver,
        type: TransactionTypeEnum.Payment,
      };
    default:
      break;
  }

  return {
    ...baseTransaction,
    type: TransactionTypeEnum.Unknown,
  };
}

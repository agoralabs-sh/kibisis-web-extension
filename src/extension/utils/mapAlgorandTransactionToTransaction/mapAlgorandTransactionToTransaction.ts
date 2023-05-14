import { decode as decodeBase64 } from '@stablelib/base64';
import { decode as decodeUtf8 } from '@stablelib/utf8';
import { BigNumber } from 'bignumber.js';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

// Types
import {
  IAlgorandTransaction,
  IBaseTransaction,
  ITransactions,
} from '@extension/types';

// Utils
import parseApplicationTransaction from './parseApplicationTransaction';
import parseAssetConfigTransaction from './parseAssetConfigTransaction';
import parseAssetFreezeTransaction from './parseAssetFreezeTransaction';
import parseAssetTransferTransaction from './parseAssetTransferTransaction';
import parseKeyRegistrationTransaction from './parseKeyRegistrationTransaction';
import parsePaymentTransaction from './parsePaymentTransaction';

export default function mapAlgorandTransactionToTransaction(
  algorandTransaction: IAlgorandTransaction
): ITransactions {
  const baseTransaction: IBaseTransaction = {
    completedAt: algorandTransaction['round-time']
      ? new BigNumber(String(algorandTransaction['round-time'] as bigint))
          .multipliedBy(1000) // we want milliseconds, as 'round-time' is in seconds
          .toNumber()
      : null,
    fee: new BigNumber(String(algorandTransaction.fee as bigint)).toString(),
    id: algorandTransaction.id || null,
    genesisHash: algorandTransaction['genesis-hash'] || null,
    groupId: algorandTransaction.group || null,
    note: algorandTransaction.note
      ? decodeUtf8(decodeBase64(algorandTransaction.note))
      : null,
    sender: algorandTransaction.sender,
  };

  switch (algorandTransaction['tx-type']) {
    case 'acfg':
      return parseAssetConfigTransaction(
        algorandTransaction['asset-config-transaction'],
        baseTransaction
      );
    case 'afrz':
      return parseAssetFreezeTransaction(
        algorandTransaction['asset-freeze-transaction'],
        baseTransaction
      );
    case 'appl':
      return parseApplicationTransaction(
        algorandTransaction['application-transaction'],
        baseTransaction,
        algorandTransaction['inner-txns']
      );
    case 'axfer':
      return parseAssetTransferTransaction(
        algorandTransaction['asset-transfer-transaction'],
        baseTransaction
      );
    case 'keyreg':
      return parseKeyRegistrationTransaction(
        algorandTransaction['keyreg-transaction'],
        baseTransaction
      );
    case 'pay':
      return parsePaymentTransaction(
        algorandTransaction['payment-transaction'],
        baseTransaction
      );
    default:
      break;
  }

  return {
    ...baseTransaction,
    type: TransactionTypeEnum.Unknown,
  };
}

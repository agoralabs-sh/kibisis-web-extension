import { BigNumber } from 'bignumber.js';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// types
import type {
  IAlgorandTransaction,
  IBaseTransaction,
  ITransactions,
} from '@extension/types';

// utils
import parseApplicationTransaction from './parseApplicationTransaction';
import parseAssetConfigTransaction from './parseAssetConfigTransaction';
import parseAssetFreezeTransaction from './parseAssetFreezeTransaction';
import parseAssetTransferTransaction from './parseAssetTransferTransaction';
import parseKeyRegistrationTransaction from './parseKeyRegistrationTransaction';
import parseNote from './parseNote';
import parsePaymentAndReKeyTransaction from './parsePaymentAndReKeyTransaction';

export default function mapAlgorandTransactionToTransaction(
  avmTransaction: IAlgorandTransaction
): ITransactions {
  const baseTransaction: IBaseTransaction = {
    authAddr: avmTransaction['auth-addr'] || null,
    completedAt: avmTransaction['round-time']
      ? new BigNumber(String(avmTransaction['round-time'] as bigint))
          .multipliedBy(1000) // we want milliseconds, as 'round-time' is in seconds
          .toNumber()
      : null,
    fee: new BigNumber(String(avmTransaction.fee as bigint)).toFixed(),
    id: avmTransaction.id || null,
    genesisHash: avmTransaction['genesis-hash'] || null,
    groupId: avmTransaction.group || null,
    note: avmTransaction.note ? parseNote(avmTransaction.note) : null,
    rekeyTo: avmTransaction['rekey-to'] || null,
    sender: avmTransaction.sender,
  };

  switch (avmTransaction['tx-type']) {
    case 'acfg':
      return parseAssetConfigTransaction(
        avmTransaction['asset-config-transaction'],
        baseTransaction
      );
    case 'afrz':
      return parseAssetFreezeTransaction(
        avmTransaction['asset-freeze-transaction'],
        baseTransaction
      );
    case 'appl':
      return parseApplicationTransaction(
        avmTransaction['application-transaction'],
        baseTransaction,
        avmTransaction['inner-txns']
      );
    case 'axfer':
      return parseAssetTransferTransaction(
        avmTransaction['asset-transfer-transaction'],
        baseTransaction
      );
    case 'keyreg':
      return parseKeyRegistrationTransaction(
        avmTransaction['keyreg-transaction'],
        baseTransaction
      );
    case 'pay':
      return parsePaymentAndReKeyTransaction(
        avmTransaction['payment-transaction'],
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

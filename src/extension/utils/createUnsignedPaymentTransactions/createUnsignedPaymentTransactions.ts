import {
  Algodv2,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// types
import type { IOptions } from './types';

// utils
import createAlgodClientFromNetwork from '@common/utils/createAlgodClientFromNetwork';

/**
 * Convenience function that creates the transactions to make a payment.
 * @param {IOptions} options - the fields needed to create a transaction.
 * @returns {Transaction[]} the transactions needed to make a payment.
 */
export default async function createUnsignedPaymentTransactions({
  amountInAtomicUnits,
  fromAddress,
  logger,
  network,
  note,
  toAddress,
}: IOptions): Promise<Transaction[]> {
  const algodClient = createAlgodClientFromNetwork(network);
  const suggestedParams: SuggestedParams = await algodClient
    .getTransactionParams()
    .do();

  return [
    makePaymentTxnWithSuggestedParams(
      fromAddress,
      toAddress,
      BigInt(amountInAtomicUnits),
      undefined,
      note ? new TextEncoder().encode(note) : undefined,
      suggestedParams
    ),
  ];
}

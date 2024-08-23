import {
  Algodv2,
  makePaymentTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// models
import NetworkClient from '@extension/models/NetworkClient';

// types
import type { IOptions } from './types';

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
  nodeID,
  note,
  toAddress,
}: IOptions): Promise<Transaction[]> {
  const networkClient = new NetworkClient({ logger, network });

  return [
    makePaymentTxnWithSuggestedParams(
      fromAddress,
      toAddress,
      BigInt(amountInAtomicUnits),
      undefined,
      note ? new TextEncoder().encode(note) : undefined,
      await networkClient.suggestedParams(nodeID)
    ),
  ];
}

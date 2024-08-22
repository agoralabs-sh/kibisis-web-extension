import {
  makeAssetTransferTxnWithSuggestedParams,
  type Transaction,
} from 'algosdk';

// types
import type { IOptions } from './types';

// models
import NetworkClient from '@extension/models/NetworkClient';

/**
 * Convenience function that creates the transactions to transfer a standard asset.
 * @param {IOptions} options - the fields needed to create a transaction.
 * @returns {Transaction[]} the transactions needed to transfer a standard asset.
 */
export default async function createUnsignedStandardAssetTransferTransactions({
  amountInAtomicUnits,
  asset,
  fromAddress,
  logger,
  network,
  nodeID,
  note,
  toAddress,
}: IOptions): Promise<Transaction[]> {
  const networkClient = new NetworkClient({ logger, network });

  return [
    makeAssetTransferTxnWithSuggestedParams(
      fromAddress,
      toAddress,
      undefined,
      undefined,
      BigInt(amountInAtomicUnits),
      note ? new TextEncoder().encode(note) : undefined,
      parseInt(asset.id),
      await networkClient.suggestedParams(nodeID)
    ),
  ];
}

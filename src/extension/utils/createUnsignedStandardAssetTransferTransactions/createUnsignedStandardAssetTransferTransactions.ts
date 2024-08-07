import {
  Algodv2,
  makeAssetTransferTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';

// types
import type { IOptions } from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';

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
  note,
  toAddress,
}: IOptions): Promise<Transaction[]> {
  const algodClient: Algodv2 = createAlgodClient(network);
  const suggestedParams: SuggestedParams = await algodClient
    .getTransactionParams()
    .do();

  return [
    makeAssetTransferTxnWithSuggestedParams(
      fromAddress,
      toAddress,
      undefined,
      undefined,
      BigInt(amountInAtomicUnits),
      note ? new TextEncoder().encode(note) : undefined,
      parseInt(asset.id),
      suggestedParams
    ),
  ];
}

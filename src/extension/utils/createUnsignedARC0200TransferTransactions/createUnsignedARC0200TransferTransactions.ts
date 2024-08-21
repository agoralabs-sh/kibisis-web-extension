import { Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';

// contracts
import ARC0200Contract from '@extension/contracts/ARC0200Contract';

// types
import type { IOptions } from './types';

/**
 * Convenience function that creates the transactions need to transfer an ARC-0200 asset. The transactions may include
 * a payment transaction that is needed to fund the box storage.
 * @param {IOptions} options - the fields needed to create a transaction.
 * @returns {Transaction[]} the transactions needed to transfer an ARC-0200 asset.
 */
export default async function createUnsignedARC0200TransferTransactions({
  amountInAtomicUnits,
  asset,
  authAddress,
  customNode,
  fromAddress,
  logger,
  network,
  note,
  toAddress,
}: IOptions): Promise<Transaction[]> {
  const contract: ARC0200Contract = new ARC0200Contract({
    appId: asset.id,
    customNode,
    logger,
    network,
  });

  return await contract.buildUnsignedTransferTransactions({
    amountInAtomicUnits: new BigNumber(amountInAtomicUnits),
    fromAddress,
    toAddress,
    ...(authAddress && {
      authAddress,
    }),
    ...(note && {
      note,
    }),
  });
}

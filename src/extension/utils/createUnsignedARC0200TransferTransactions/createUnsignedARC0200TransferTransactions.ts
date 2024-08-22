import { Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';

// contracts
import ARC0200Contract from '@extension/contracts/ARC0200Contract';

// models
import NetworkClient from '@extension/models/NetworkClient';

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
  fromAddress,
  logger,
  network,
  nodeID,
  note,
  toAddress,
}: IOptions): Promise<Transaction[]> {
  const networkClient = new NetworkClient({ logger, network });
  let contract: ARC0200Contract;

  contract = new ARC0200Contract({
    algod: networkClient.algodByID(nodeID),
    appId: asset.id,
    feeSinkAddress: networkClient.feeSinkAddress(),
    logger,
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

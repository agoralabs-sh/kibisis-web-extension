// constants
import {
  DEFAULT_TRANSACTION_INDEXER_LIMIT,
  NODE_REQUEST_DELAY,
} from '@extension/constants';

// model
import NetworkClient from '@extension/models/NetworkClient';

// types
import type {
  IAlgorandAccountTransaction,
  ITransactions,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import mapAlgorandTransactionToTransaction from '../mapAlgorandTransactionToTransaction';

/**
 * Fetches all latest transactions from a given time. This function runs recursively until the 'next-token' is
 * undefined.
 * @param {IOptions} options - options needed to get the latest transactions.
 * @returns {Promise<ITransactions[]>} the latest transactions from a given time.
 */
export default async function refreshTransactions({
  address,
  afterTime,
  delay = 0,
  logger,
  network,
  next,
  nodeID,
}: IOptions): Promise<ITransactions[]> {
  const _functionName = 'refreshTransactions';
  const networkClient = new NetworkClient({ logger, network });
  let avmAccountTransactions: IAlgorandAccountTransaction;
  let newestTransactions: ITransactions[];

  try {
    avmAccountTransactions =
      await networkClient.lookupAccountTransactionWithDelay({
        address,
        afterTime,
        delay,
        limit: DEFAULT_TRANSACTION_INDEXER_LIMIT,
        next,
        nodeID,
      });
    newestTransactions = avmAccountTransactions.transactions.map(
      mapAlgorandTransactionToTransaction
    );

    logger?.debug(
      `${_functionName}: updated account transactions for account "${address}" for network "${network.genesisId}"`
    );

    // if there is still more, recursively get them until there are no more pages (no more next tokens)
    if (avmAccountTransactions['next-token']) {
      return [
        ...newestTransactions, // the indexer always returns the newest > oldest
        ...(await refreshTransactions({
          address,
          afterTime,
          delay: NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          logger,
          network,
          next: avmAccountTransactions['next-token'],
          nodeID,
        })),
      ];
    }

    return newestTransactions;
  } catch (error) {
    logger?.error(
      `${_functionName}: failed to get transactions for "${address}" on ${network.genesisId}: ${error.message}`
    );

    return [];
  }
}

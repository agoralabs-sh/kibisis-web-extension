import { Indexer } from 'algosdk';

// constants
import {
  DEFAULT_TRANSACTION_INDEXER_LIMIT,
  NODE_REQUEST_DELAY,
} from '@extension/constants';

// types
import { IBaseOptions } from '@common/types';
import {
  IAlgorandAccountTransaction,
  INetwork,
  ITransactions,
} from '@extension/types';

// utils
import mapAlgorandTransactionToTransaction from '@extension/utils/mapAlgorandTransactionToTransaction';
import lookupAlgorandAccountTransactionsWithDelay from './lookupAlgorandAccountTransactionsWithDelay';

interface IOptions extends IBaseOptions {
  address: string;
  afterTime: number;
  client: Indexer;
  delay?: number;
  next: string | null;
  network: INetwork;
}

/**
 * Fetches all latest transactions from a given time. This function runs recursively until the 'next-token' is
 * undefined.
 * @param {IOptions} options - options needed to get the latest transactions.
 * @returns {Promise<ITransactions[]>} the latest transactions from a given time.
 */
export default async function refreshTransactions({
  address,
  afterTime,
  client,
  delay = 0,
  logger,
  network,
  next,
}: IOptions): Promise<ITransactions[]> {
  let algorandAccountTransactions: IAlgorandAccountTransaction;
  let newestTransactions: ITransactions[];

  try {
    algorandAccountTransactions =
      await lookupAlgorandAccountTransactionsWithDelay({
        address,
        afterTime,
        client,
        delay,
        limit: DEFAULT_TRANSACTION_INDEXER_LIMIT,
        next,
      });
    newestTransactions = algorandAccountTransactions.transactions.map(
      mapAlgorandTransactionToTransaction
    );

    // if there is still more, recursively get them until there are no more pages (no more next tokens)
    if (algorandAccountTransactions['next-token']) {
      return [
        ...newestTransactions, // the indexer always returns the newest > oldest
        ...(await refreshTransactions({
          address,
          afterTime,
          client,
          delay: NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          logger,
          network,
          next: algorandAccountTransactions['next-token'],
        })),
      ];
    }

    return newestTransactions;
  } catch (error) {
    logger &&
      logger.error(
        `${refreshTransactions.name}: failed to get transactions for "${address}" on ${network.genesisId}: ${error.message}`
      );

    return [];
  }
}

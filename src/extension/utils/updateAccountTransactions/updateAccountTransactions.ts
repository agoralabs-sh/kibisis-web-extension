// constants
import { DEFAULT_TRANSACTION_INDEXER_LIMIT } from '@extension/constants';

// types
import type {
  IAccountTransactions,
  IAlgorandAccountTransaction,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import getIndexerClient from '@common/utils/getIndexerClient';
import lookupAlgorandAccountTransactionsWithDelay from '../lookupAlgorandAccountTransactionsWithDelay';
import mapAlgorandTransactionToTransaction from '../mapAlgorandTransactionToTransaction';
import refreshTransactions from '../refreshTransactions';

/**
 * Gets the account transactions.
 * @param {IOptions} options - options needed to fetch account transactions.
 * @returns {Promise<IAccountTransactions>} a promise that resolves to the updated account transactions.
 */
export default async function updateAccountTransactions({
  address,
  currentAccountTransactions,
  delay = 0,
  logger,
  network,
  refresh = false,
}: IOptions): Promise<IAccountTransactions> {
  const client = getIndexerClient(network, {
    logger,
  });
  let algorandAccountTransaction: IAlgorandAccountTransaction;
  let mostRecentTransactionTime: number;

  // if it is a refresh, get all the transactions from the most recent transaction
  if (refresh && currentAccountTransactions.transactions.length > 0) {
    // get the date of the most recent transaction
    mostRecentTransactionTime = currentAccountTransactions.transactions.reduce(
      (acc, value) =>
        value.completedAt && value.completedAt > acc ? value.completedAt : acc,
      0
    );

    return {
      ...currentAccountTransactions,
      transactions: [
        // get the most recent transactions
        ...(await refreshTransactions({
          address,
          afterTime: mostRecentTransactionTime,
          client,
          logger,
          network,
          next: null,
        })),
        ...currentAccountTransactions.transactions,
      ],
    };
  }

  try {
    algorandAccountTransaction =
      await lookupAlgorandAccountTransactionsWithDelay({
        address,
        afterTime: null,
        client,
        delay,
        limit: DEFAULT_TRANSACTION_INDEXER_LIMIT,
        next: currentAccountTransactions.next,
      });

    return {
      next: algorandAccountTransaction['next-token'] || null,
      transactions: [
        ...currentAccountTransactions.transactions,
        ...algorandAccountTransaction.transactions.map(
          mapAlgorandTransactionToTransaction
        ),
      ],
    };
  } catch (error) {
    logger?.error(
      `${updateAccountTransactions.name}: failed to get account transactions for "${address}" on ${network.genesisId}:`,
      error
    );

    return currentAccountTransactions;
  }
}

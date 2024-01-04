import { Indexer } from 'algosdk';

// constants
import { DEFAULT_TRANSACTION_INDEXER_LIMIT } from '@extension/constants';

// types
import { IBaseOptions } from '@common/types';
import {
  IAccountTransactions,
  IAlgorandAccountTransaction,
  INetwork,
} from '@extension/types';

// utils
import getIndexerClient from '@common/utils/getIndexerClient';
import mapAlgorandTransactionToTransaction from '@extension/utils/mapAlgorandTransactionToTransaction';
import lookupAlgorandAccountTransactionsWithDelay from './lookupAlgorandAccountTransactionsWithDelay';
import refreshTransactions from './refreshTransactions';

interface IOptions extends IBaseOptions {
  address: string;
  currentAccountTransactions: IAccountTransactions;
  delay?: number;
  network: INetwork;
  refresh?: boolean;
}

/**
 * Gets the account transactions.
 * @param {IOptions} options - options needed to fetch account transactions.
 * @returns {Promise<IAccountTransactions>} the updated account information.
 */
export default async function updateAccountTransactions({
  address,
  currentAccountTransactions,
  delay = 0,
  logger,
  network,
  refresh = false,
}: IOptions): Promise<IAccountTransactions> {
  const client: Indexer = getIndexerClient(network, {
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

    logger &&
      logger.debug(
        `${
          updateAccountTransactions.name
        }: 'refreshing account transactions for "${address}" on "${
          network.genesisId
        }" from "${new Date(mostRecentTransactionTime).toString()}"`
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

  logger &&
    logger.debug(
      `${updateAccountTransactions.name}: 'updating account transactions for "${address}" on "${network.genesisId}"`
    );

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
    logger &&
      logger.error(
        `${updateAccountTransactions.name}: failed to get account transactions for "${address}" on ${network.genesisId}: ${error.message}`
      );

    return currentAccountTransactions;
  }
}

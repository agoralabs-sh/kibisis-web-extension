import { Indexer, IntDecoding } from 'algosdk';
import LookupAccountTransactions from 'algosdk/dist/types/client/v2/indexer/lookupAccountTransactions';

// services
import { AccountService } from '@extension/services';

// types
import { IBaseOptions } from '@common/types';
import {
  IAccount,
  IAccountTransactions,
  IAlgorandAccountTransaction,
  INetwork,
} from '@extension/types';

// utils
import { getIndexerClient } from '@common/utils';
import {
  convertGenesisHashToHex,
  mapAlgorandTransactionToTransaction,
} from '@extension/utils';

interface IOptions extends IBaseOptions {
  network: INetwork;
  refresh?: boolean;
}

/**
 * Fetches the account information for a given address.
 * @param {IAccount} account - the account.
 * @param {IOptions} options - options needed to update the account information.
 * @returns {Promise<IAccountInformation>} the updated account information.
 */
export default async function updateAccountTransactions(
  account: IAccount,
  { logger, network, refresh = false }: IOptions
): Promise<IAccountTransactions> {
  const encodedGenesisHash: string = convertGenesisHashToHex(
    network.genesisHash
  ).toUpperCase();
  const accountTransactions: IAccountTransactions =
    account.networkTransactions[encodedGenesisHash] ||
    AccountService.initializeDefaultAccountTransactions();
  let address: string;
  let algorandAccountTransaction: IAlgorandAccountTransaction;
  let client: Indexer;
  let limit: number = 20; // default
  let next: string | null = null;
  let requestBuilder: LookupAccountTransactions;

  // if we are not refreshing, we can get the latest from the next token
  if (!refresh) {
    next = accountTransactions.next;
  }

  // if we are refreshing, increase the limit to the number of transactions, but set a hard limit of 100
  if (refresh) {
    if (accountTransactions.transactions.length > 0) {
      limit =
        accountTransactions.transactions.length > limit
          ? accountTransactions.transactions.length
          : limit;

      if (limit > 100) {
        limit = 100;
      }
    }
  }

  address = AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);
  client = getIndexerClient(network, {
    logger,
  });

  logger &&
    logger.debug(
      `${updateAccountTransactions.name}: ${
        refresh ? 'refreshing' : 'updating'
      } account transactions for "${account.id}" on "${network.genesisId}"${
        next ? ` using next-token "${next}"` : ''
      }`
    );

  try {
    requestBuilder = client.lookupAccountTransactions(address).limit(limit);

    if (next) {
      requestBuilder.nextToken(next);
    }

    algorandAccountTransaction = (await requestBuilder
      .setIntDecoding(IntDecoding.BIGINT)
      .do()) as IAlgorandAccountTransaction;

    return {
      next: algorandAccountTransaction['next-token'] || null,
      transactions: [
        ...(!refresh ? accountTransactions.transactions : []), // if it is not refreshing, append the previous transactions
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

    return accountTransactions;
  }
}

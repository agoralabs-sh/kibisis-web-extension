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
}

/**
 * Fetches the account information for a given address.
 * @param {IAccount} account - the account.
 * @param {IOptions} options - options needed to update the account information.
 * @returns {Promise<IAccountInformation>} the updated account information.
 */
export default async function updateAccountTransactions(
  account: IAccount,
  { logger, network }: IOptions
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
  let next: string | null = null;
  let requestBuilder: LookupAccountTransactions;

  // if there is network account transactions, we can get the latest from the next token
  if (accountTransactions) {
    next = accountTransactions.next;
  }

  address = AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);
  client = getIndexerClient(network, {
    logger,
  });

  logger &&
    logger.debug(
      `${updateAccountTransactions.name}: updating account transactions for "${
        account.id
      }" on "${network.genesisId}"${next ? ` using next-token "${next}"` : ''}`
    );

  try {
    requestBuilder = client.lookupAccountTransactions(address).limit(20);

    if (next) {
      requestBuilder.nextToken(next);
    }

    algorandAccountTransaction = (await requestBuilder
      .setIntDecoding(IntDecoding.BIGINT)
      .do()) as IAlgorandAccountTransaction;

    return {
      next: algorandAccountTransaction['next-token'] || null,
      transactions: [
        ...accountTransactions.transactions,
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

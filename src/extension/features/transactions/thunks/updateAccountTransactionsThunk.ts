import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Indexer, IntDecoding } from 'algosdk';

// Enums
import { TransactionsThunkEnum } from '@extension/enums';

// Services
import { AccountService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAlgorandAccountTransaction,
  IMainRootState,
  INetwork,
} from '@extension/types';
import {
  IAccountTransaction,
  IUpdateAccountTransactionsResult,
} from '../types';

// Utils
import { getIndexerClient } from '@common/utils';
import { mapAlgorandTransactionToTransaction } from '@extension/utils';

const updateAccountTransactionsThunk: AsyncThunk<
  IUpdateAccountTransactionsResult | null, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<
  IUpdateAccountTransactionsResult | null,
  string,
  { state: IMainRootState }
>(
  TransactionsThunkEnum.UpdateAccountTransactions,
  async (accountId, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const online: boolean = getState().system.online;
    let account: IAccount | null;
    let accountTransaction: IAccountTransaction | null;
    let algorandAccountTransaction: IAlgorandAccountTransaction;
    let address: string;
    let client: Indexer;
    let next: string | null = null;
    let selectedNetwork: INetwork | null;

    if (!online) {
      logger.debug(
        `${TransactionsThunkEnum.UpdateAccountTransactions}: the extension appears to be offline, ignoring`
      );

      return null;
    }

    selectedNetwork =
      networks.find(
        (value) =>
          value.genesisHash ===
          getState().settings.general.selectedNetworkGenesisHash
      ) || null;

    if (!selectedNetwork) {
      logger.debug(
        `${TransactionsThunkEnum.UpdateAccountTransactions}: no network selected, ignoring`
      );

      return null;
    }

    account =
      getState().accounts.items.find((value) => value.id === accountId) || null;

    if (!account) {
      logger.debug(
        `${TransactionsThunkEnum.UpdateAccountTransactions}: no account found for "${accountId}", ignoring`
      );

      return null;
    }

    accountTransaction =
      getState().transactions.items.find(
        (value) => value.accountId === accountId
      ) || null;

    if (accountTransaction) {
      next = accountTransaction.next;
    }

    address = AccountService.convertPublicKeyToAlgorandAddress(
      account.publicKey
    );
    client = getIndexerClient(selectedNetwork);

    logger.debug(
      `${TransactionsThunkEnum.UpdateAccountTransactions}: ${
        next ? 'updating' : 'fetching'
      } account transaction for "${accountId}" on "${
        selectedNetwork.genesisId
      }"`
    );

    try {
      algorandAccountTransaction = (await client
        .lookupAccountTransactions(address)
        .setIntDecoding(IntDecoding.BIGINT)
        .do()) as IAlgorandAccountTransaction;
    } catch (error) {
      logger &&
        logger.error(
          `${TransactionsThunkEnum.UpdateAccountTransactions}: failed to get account transactions for "${address}" on ${selectedNetwork.genesisId}: ${error.message}`
        );

      return null;
    }

    return {
      accountId,
      next: algorandAccountTransaction['next-token'],
      transactions: algorandAccountTransaction.transactions.map(
        mapAlgorandTransactionToTransaction
      ),
    };
  }
);

export default updateAccountTransactionsThunk;

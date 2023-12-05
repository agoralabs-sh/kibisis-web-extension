import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';
import { IUpdateAccountTransactionsPayload } from '../types';

// utils
import {
  convertGenesisHashToHex,
  selectNetworkFromSettings,
} from '@extension/utils';
import { updateAccountTransactions } from '../utils';

const updateAccountTransactionsThunk: AsyncThunk<
  IAccount[], // return
  IUpdateAccountTransactionsPayload | undefined, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount[],
  IUpdateAccountTransactionsPayload | undefined,
  { state: IMainRootState }
>(
  AccountsThunkEnum.UpdateAccountTransactions,
  async ({ accountIds, refresh } = { refresh: false }, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(networks, getState().settings);
    let accounts: IAccount[] = getState().accounts.items;

    if (!online) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountTransactions}: the extension appears to be offline, ignoring`
      );

      return [];
    }

    if (!selectedNetwork) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountTransactions}: no network selected, ignoring`
      );

      return [];
    }

    // if we have account ids, get all the accounts that match
    if (accountIds) {
      accounts = accounts.filter(
        (account) => !!accountIds.find((value) => value === account.id)
      );
    }

    return await Promise.all(
      accounts.map(async (account, index) => ({
        ...account,
        networkTransactions: {
          ...account.networkTransactions,
          [convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()]:
            await updateAccountTransactions(account, {
              delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              logger,
              network: selectedNetwork,
              refresh,
            }),
        },
      }))
    );
  }
);

export default updateAccountTransactionsThunk;

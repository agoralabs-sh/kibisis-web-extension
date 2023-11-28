import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, INetwork } from '@extension/types';

// utils
import {
  convertGenesisHashToHex,
  selectNetworkFromSettings,
} from '@extension/utils';
import { updateAccountTransactions } from '../utils';

const updateAccountTransactionsForAccountThunk: AsyncThunk<
  IAccount | null, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<IAccount | null, string, { state: IMainRootState }>(
  AccountsThunkEnum.UpdateAccountTransactionsForAccount,
  async (accountId, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const online: boolean = getState().system.online;
    let account: IAccount | null;
    let encodedGenesisHash: string;
    let selectedNetwork: INetwork | null;

    if (!online) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountTransactionsForAccount}: the extension appears to be offline, ignoring`
      );

      return null;
    }

    selectedNetwork = selectNetworkFromSettings(networks, getState().settings);

    if (!selectedNetwork) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountTransactionsForAccount}: no network selected, ignoring`
      );

      return null;
    }

    account =
      getState().accounts.items.find((value) => value.id === accountId) || null;

    if (!account) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountTransactionsForAccount}: no account found for "${accountId}", ignoring`
      );

      return null;
    }

    encodedGenesisHash = convertGenesisHashToHex(
      selectedNetwork.genesisHash
    ).toUpperCase();

    return {
      ...account,
      networkTransactions: {
        ...account.networkTransactions,
        [encodedGenesisHash]: await updateAccountTransactions(account, {
          logger,
          network: selectedNetwork,
        }),
      },
    };
  }
);

export default updateAccountTransactionsForAccountThunk;

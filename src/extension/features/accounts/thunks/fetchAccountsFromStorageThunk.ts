import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import { AccountService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, INetwork } from '@extension/types';
import { IFetchAccountsFromStoragePayload } from '../types';

// utils
import {
  convertGenesisHashToHex,
  selectNetworkFromSettings,
} from '@extension/utils';
import { updateAccountInformation, updateAccountTransactions } from '../utils';

const fetchAccountsFromStorageThunk: AsyncThunk<
  IAccount[], // return
  IFetchAccountsFromStoragePayload | undefined, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount[],
  IFetchAccountsFromStoragePayload | undefined,
  { state: IMainRootState }
>(AccountsThunkEnum.FetchAccountsFromStorage, async (options, { getState }) => {
  const logger: ILogger = getState().system.logger;
  const networks: INetwork[] = getState().networks.items;
  const online: boolean = getState().system.online;
  const accountService: AccountService = new AccountService({
    logger,
  });
  const selectedNetwork: INetwork | null = selectNetworkFromSettings(
    networks,
    getState().settings
  );
  let accounts: IAccount[];
  let encodedGenesisHash: string;

  logger.debug(
    `${AccountsThunkEnum.FetchAccountsFromStorage}: fetching accounts from storage`
  );

  accounts = await accountService.getAllAccounts();
  accounts = accounts.sort((a, b) => a.createdAt - b.createdAt); // sort by created at date (oldest first)

  if (online && selectedNetwork) {
    encodedGenesisHash = convertGenesisHashToHex(
      selectedNetwork.genesisHash
    ).toUpperCase();

    // update the account information for selected network
    if (options?.updateAccountInformation) {
      logger.debug(
        `${AccountsThunkEnum.FetchAccountsFromStorage}: updating account information for "${selectedNetwork.genesisId}"`
      );

      accounts = await Promise.all(
        accounts.map(async (account, index) => ({
          ...account,
          networkInformation: {
            ...account.networkInformation,
            [encodedGenesisHash]: await updateAccountInformation(account, {
              delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              logger,
              network: selectedNetwork,
            }),
          },
        }))
      );

      // save accounts to storage
      accounts = await accountService.saveAccounts(accounts);
    }

    // update the accounts transactions for selected network
    if (options?.updateAccountTransactions) {
      logger.debug(
        `${AccountsThunkEnum.FetchAccountsFromStorage}: updating account transactions for "${selectedNetwork.genesisId}"`
      );

      accounts = await Promise.all(
        accounts.map(async (account, index) => ({
          ...account,
          networkTransactions: {
            ...account.networkTransactions,
            [encodedGenesisHash]: await updateAccountTransactions(account, {
              logger,
              network: selectedNetwork,
            }),
          },
        }))
      );

      // save accounts to storage
      accounts = await accountService.saveAccounts(accounts);
    }
  }

  return accounts;
});

export default fetchAccountsFromStorageThunk;

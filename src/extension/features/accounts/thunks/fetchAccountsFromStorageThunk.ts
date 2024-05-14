import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import AccountService from '@extension/services/AccountService';

// types
import {
  IAccount,
  IActiveAccountDetails,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type {
  IFetchAccountsFromStoragePayload,
  IFetchAccountsFromStorageResult,
} from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import isWatchAccount from '@extension/utils/isWatchAccount';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import updateAccountInformation from '@extension/utils/updateAccountInformation';
import updateAccountTransactions from '@extension/utils/updateAccountTransactions';

const fetchAccountsFromStorageThunk: AsyncThunk<
  IFetchAccountsFromStorageResult, // return
  IFetchAccountsFromStoragePayload | undefined, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IFetchAccountsFromStorageResult,
  IFetchAccountsFromStoragePayload | undefined,
  IBaseAsyncThunkConfig<IMainRootState>
>(AccountsThunkEnum.FetchAccountsFromStorage, async (options, { getState }) => {
  const logger = getState().system.logger;
  const networks = getState().networks.items;
  const online = getState().system.online;
  const accountService = new AccountService({
    logger,
  });
  const selectedNetwork = selectNetworkFromSettings(
    networks,
    getState().settings
  );
  let accounts: IAccount[];
  let activeAccountDetails: IActiveAccountDetails | null;
  let encodedGenesisHash: string;

  logger.debug(
    `${AccountsThunkEnum.FetchAccountsFromStorage}: fetching accounts from storage`
  );

  accounts = await accountService.getAllAccounts();
  accounts = accounts.sort((a, b) => a.createdAt - b.createdAt); // sort by created at date (oldest first)
  activeAccountDetails = await accountService.getActiveAccountDetails();

  if (online && selectedNetwork) {
    encodedGenesisHash = convertGenesisHashToHex(
      selectedNetwork.genesisHash
    ).toUpperCase();

    // update the account information for selected network
    if (options?.updateInformation) {
      logger.debug(
        `${AccountsThunkEnum.FetchAccountsFromStorage}: updating account information for "${selectedNetwork.genesisId}"`
      );

      accounts = await Promise.all(
        accounts.map(async (account, index) => ({
          ...account,
          networkInformation: {
            ...account.networkInformation,
            [encodedGenesisHash]: await updateAccountInformation({
              address: AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              ),
              currentAccountInformation:
                account.networkInformation[encodedGenesisHash] ||
                AccountService.initializeDefaultAccountInformation(),
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
    if (options?.updateTransactions) {
      logger.debug(
        `${AccountsThunkEnum.FetchAccountsFromStorage}: updating account transactions for "${selectedNetwork.genesisId}"`
      );

      accounts = await Promise.all(
        accounts.map(async (account, index) => ({
          ...account,
          networkTransactions: {
            ...account.networkTransactions,
            [encodedGenesisHash]: await updateAccountTransactions({
              address: AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              ),
              currentAccountTransactions:
                account.networkTransactions[encodedGenesisHash] ||
                AccountService.initializeDefaultAccountTransactions(),
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
  }

  return {
    accounts: await Promise.all(
      accounts.map(async (account) => ({
        ...account,
        watchAccount: await isWatchAccount({ account, logger }),
      }))
    ),
    activeAccountDetails,
  };
});

export default fetchAccountsFromStorageThunk;

import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { ThunkEnum } from '../enums';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccount,
  IActiveAccountDetails,
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type {
  IFetchAccountsFromStoragePayload,
  IFetchAccountsFromStorageResult,
} from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import isWatchAccount from '@extension/utils/isWatchAccount';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import updateAccountInformation from '@extension/utils/updateAccountInformation';
import updateAccountTransactions from '@extension/utils/updateAccountTransactions';

const fetchAccountsFromStorageThunk: AsyncThunk<
  IFetchAccountsFromStorageResult, // return
  IFetchAccountsFromStoragePayload | undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  IFetchAccountsFromStorageResult,
  IFetchAccountsFromStoragePayload | undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.FetchAccountsFromStorage, async (options, { getState }) => {
  const logger = getState().system.logger;
  const networks = getState().networks.items;
  const online = getState().system.networkConnectivity.online;
  const settings = getState().settings;
  const accountService = new AccountService({
    logger,
  });
  const network = selectNetworkFromSettings({
    networks,
    settings,
  });
  let accounts: IAccount[];
  let activeAccountDetails: IActiveAccountDetails | null;
  let encodedGenesisHash: string;

  logger.debug(
    `${ThunkEnum.FetchAccountsFromStorage}: fetching accounts from storage`
  );

  accounts = await accountService.getAllAccounts();
  accounts = accounts.sort((a, b) => a.createdAt - b.createdAt); // sort by created at date (oldest first)
  activeAccountDetails = await accountService.getActiveAccountDetails();

  if (online && network) {
    encodedGenesisHash = convertGenesisHashToHex(
      network.genesisHash
    ).toUpperCase();

    // update the account information for selected network
    if (options?.updateInformation) {
      logger.debug(
        `${ThunkEnum.FetchAccountsFromStorage}: updating account information for "${network.genesisId}"`
      );

      accounts = await Promise.all(
        accounts.map(async (account, index) => ({
          ...account,
          networkInformation: {
            ...account.networkInformation,
            [encodedGenesisHash]: await updateAccountInformation({
              address: convertPublicKeyToAVMAddress(
                PrivateKeyService.decode(account.publicKey)
              ),
              currentAccountInformation:
                account.networkInformation[encodedGenesisHash] ||
                AccountService.initializeDefaultAccountInformation(),
              delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              logger,
              network,
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
        `${ThunkEnum.FetchAccountsFromStorage}: updating account transactions for "${network.genesisId}"`
      );

      accounts = await Promise.all(
        accounts.map(async (account, index) => ({
          ...account,
          networkTransactions: {
            ...account.networkTransactions,
            [encodedGenesisHash]: await updateAccountTransactions({
              address: convertPublicKeyToAVMAddress(
                PrivateKeyService.decode(account.publicKey)
              ),
              currentAccountTransactions:
                account.networkTransactions[encodedGenesisHash] ||
                AccountService.initializeDefaultAccountTransactions(),
              delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              logger,
              network,
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

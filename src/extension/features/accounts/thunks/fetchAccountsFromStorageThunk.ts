import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';
import ActiveAccountRepositoryService from '@extension/repositories/ActiveAccountRepositoryService';

// types
import type {
  IAccount,
  IActiveAccountDetails,
  IBackgroundRootState,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { IFetchAccountsFromStorageResult } from '../types';

// utils
import isWatchAccount from '@extension/utils/isWatchAccount';

const fetchAccountsFromStorageThunk: AsyncThunk<
  IFetchAccountsFromStorageResult, // return
  undefined, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  IFetchAccountsFromStorageResult,
  undefined,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(ThunkEnum.FetchAccountsFromStorage, async (_, { getState }) => {
  const logger = getState().system.logger;
  let accounts: IAccount[];
  let activeAccountDetails: IActiveAccountDetails | null;

  logger.debug(
    `${ThunkEnum.FetchAccountsFromStorage}: fetching accounts from storage`
  );

  accounts = await new AccountRepositoryService().fetchAll();
  accounts = accounts.sort((a, b) => a.createdAt - b.createdAt); // sort by created at date (oldest first)
  activeAccountDetails = await new ActiveAccountRepositoryService().fetch();

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

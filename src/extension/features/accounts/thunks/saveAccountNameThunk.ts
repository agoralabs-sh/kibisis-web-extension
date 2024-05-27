import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountWithExtendedProps,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { ISaveAccountNamePayload } from '../types';

// utils
import isWatchAccount from '@extension/utils/isWatchAccount/isWatchAccount';
import { findAccountWithoutExtendedProps } from '../utils';

const saveAccountNameThunk: AsyncThunk<
  IAccountWithExtendedProps | null, // return
  ISaveAccountNamePayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps | null,
  ISaveAccountNamePayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.SaveAccountName, async ({ accountId, name }, { getState }) => {
  const logger = getState().system.logger;
  const accounts = getState().accounts.items;
  const accountService = new AccountService({
    logger,
  });
  let account = findAccountWithoutExtendedProps(accountId, accounts);

  if (!account) {
    logger.debug(
      `${ThunkEnum.SaveNewAccount}: no account found for "${accountId}", ignoring`
    );

    return null;
  }

  logger.debug(
    `${ThunkEnum.SaveNewAccount}: ${
      name
        ? `updating account "${accountId}" with new name "${name}"`
        : `removing account name for account "${accountId}"`
    }`
  );

  account = {
    ...account,
    name,
  };

  await accountService.saveAccounts([account]);

  return {
    ...account,
    watchAccount: await isWatchAccount({ account, logger }),
  };
});

export default saveAccountNameThunk;

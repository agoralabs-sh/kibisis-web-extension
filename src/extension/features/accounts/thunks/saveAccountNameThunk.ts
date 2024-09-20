import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type {
  IAccountWithExtendedProps,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { ISaveAccountNamePayload } from '../types';

// utils
import isWatchAccount from '@extension/utils/isWatchAccount/isWatchAccount';
import serialize from '@extension/utils/serialize';
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
  let account = serialize(findAccountWithoutExtendedProps(accountId, accounts));

  if (!account) {
    logger.debug(
      `${ThunkEnum.SaveAccountName}: no account found for "${accountId}", ignoring`
    );

    return null;
  }

  logger.debug(
    `${ThunkEnum.SaveAccountName}: ${
      name
        ? `updating account "${accountId}" with new name "${name}"`
        : `removing account name for account "${accountId}"`
    }`
  );

  account = {
    ...account,
    name,
  };

  await new AccountRepository().saveMany([account]);

  return {
    ...account,
    watchAccount: await isWatchAccount(account),
  };
});

export default saveAccountNameThunk;

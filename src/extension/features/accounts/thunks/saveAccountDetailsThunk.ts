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
import type { ISaveAccountDetailsPayload } from '../types';

// utils
import isWatchAccount from '@extension/utils/isWatchAccount/isWatchAccount';
import serialize from '@extension/utils/serialize';
import { findAccountWithoutExtendedProps } from '../utils';

const saveAccountNameThunk: AsyncThunk<
  IAccountWithExtendedProps | null, // return
  ISaveAccountDetailsPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps | null,
  ISaveAccountDetailsPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.SaveAccountDetails,
  async ({ accountId, icon, name }, { getState }) => {
    const logger = getState().system.logger;
    const accounts = getState().accounts.items;
    let account = serialize(
      findAccountWithoutExtendedProps(accountId, accounts)
    );

    if (!account) {
      logger.debug(
        `${ThunkEnum.SaveAccountDetails}: no account found for "${accountId}", ignoring`
      );

      return null;
    }

    logger.debug(
      `${ThunkEnum.SaveAccountDetails}: updating account "${accountId}" details "${icon}"`
    );

    account = {
      ...account,
      icon,
      name,
    };

    await new AccountRepository().saveMany([account]);

    return {
      ...account,
      watchAccount: await isWatchAccount(account),
    };
  }
);

export default saveAccountNameThunk;

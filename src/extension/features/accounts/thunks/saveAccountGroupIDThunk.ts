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
import type { ISaveAccountGroupIDPayload } from '../types';

// utils
import isWatchAccount from '@extension/utils/isWatchAccount/isWatchAccount';
import serialize from '@extension/utils/serialize';
import { findAccountWithoutExtendedProps } from '../utils';

const saveAccountGroupIDThunk: AsyncThunk<
  IAccountWithExtendedProps | null, // return
  ISaveAccountGroupIDPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps | null,
  ISaveAccountGroupIDPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.SaveAccountGroupID,
  async ({ accountID, groupID }, { getState }) => {
    const logger = getState().system.logger;
    const accounts = getState().accounts.items;
    let account = serialize(
      findAccountWithoutExtendedProps(accountID, accounts)
    );

    if (!account) {
      logger.debug(
        `${ThunkEnum.SaveAccountGroupID}: no account found for "${accountID}", ignoring`
      );

      return null;
    }

    logger.debug(
      `${ThunkEnum.SaveAccountGroupID}: ${
        groupID ? `adding group "${groupID}"` : `removing group`
      } from account "${accountID}"`
    );

    account = {
      ...account,
      groupID,
    };

    await new AccountRepository().saveMany([account]);

    return {
      ...account,
      watchAccount: await isWatchAccount(account),
    };
  }
);

export default saveAccountGroupIDThunk;

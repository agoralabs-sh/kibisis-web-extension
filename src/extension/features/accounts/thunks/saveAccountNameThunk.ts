import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import { AccountService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import { ISaveAccountNamePayload } from '../types';

const saveAccountNameThunk: AsyncThunk<
  IAccount | null, // return
  ISaveAccountNamePayload, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<
  IAccount | null,
  ISaveAccountNamePayload,
  { state: IMainRootState }
>(
  AccountsThunkEnum.SaveAccountName,
  async ({ accountId, name }, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;
    let account: IAccount | null =
      getState().accounts.items.find((value) => value.id === accountId) || null;
    let accountService: AccountService;

    if (!account) {
      logger.debug(
        `${AccountsThunkEnum.SaveNewAccount}: no account found for "${accountId}", ignoring`
      );

      return null;
    }

    logger.debug(
      `${AccountsThunkEnum.SaveNewAccount}: ${
        name
          ? `updating account "${accountId}" with new name "${name}"`
          : `removing account name for account "${accountId}"`
      }`
    );

    account = {
      ...account,
      name,
    };
    accountService = new AccountService({
      logger,
    });

    await accountService.saveAccounts([account]);

    return account;
  }
);

export default saveAccountNameThunk;

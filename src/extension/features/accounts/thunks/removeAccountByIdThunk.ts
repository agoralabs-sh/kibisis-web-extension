import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const removeAccountByIdThunk: AsyncThunk<
  string, // return
  string, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<string, string, IBaseAsyncThunkConfig<IMainRootState>>(
  AccountsThunkEnum.RemoveAccountById,
  async (id, { getState }) => {
    const logger = getState().system.logger;
    const accountService = new AccountService({
      logger,
    });
    const account = await accountService.getAccountById(id);
    let privateKeyService: PrivateKeyService;

    if (!account) {
      logger.debug(
        `${AccountsThunkEnum.RemoveAccountById}: account "${id}" does not exist, ignoring`
      );

      return id;
    }

    logger.debug(
      `${AccountsThunkEnum.RemoveAccountById}: removing account "${id}" from storage`
    );

    // remove the account
    await accountService.removeAccountById(account.id);

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    logger.debug(
      `${AccountsThunkEnum.RemoveAccountById}: removing private key "${account.publicKey}" from storage`
    );

    // remove the private key
    await privateKeyService.removePrivateKeyByPublicKey(account.publicKey);

    return account.id;
  }
);

export default removeAccountByIdThunk;

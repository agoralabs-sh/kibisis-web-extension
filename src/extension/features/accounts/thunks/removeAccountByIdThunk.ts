import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import { AccountService, PrivateKeyService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState } from '@extension/types';

const removeAccountByIdThunk: AsyncThunk<
  string, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string, string, { state: IMainRootState }>(
  AccountsThunkEnum.RemoveAccountById,
  async (id, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const accountService: AccountService = new AccountService({
      logger,
    });
    const account: IAccount | null = await accountService.getAccountById(id);
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

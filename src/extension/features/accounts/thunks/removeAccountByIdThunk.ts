import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const removeAccountByIdThunk: AsyncThunk<
  string, // return
  string, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<string, string, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.RemoveAccountById,
  async (id, { getState }) => {
    const logger = getState().system.logger;
    const accountRepository = new AccountRepository();
    const account = await accountRepository.fetchById(id);

    if (!account) {
      logger.debug(
        `${ThunkEnum.RemoveAccountById}: account "${id}" does not exist, ignoring`
      );

      return id;
    }

    // remove the account
    await accountRepository.removeById(account.id);

    logger.debug(
      `${ThunkEnum.RemoveAccountById}: removed account "${id}" from storage`
    );

    // remove the private key
    await new PrivateKeyRepository().removeByPublicKey(account.publicKey);

    logger.debug(
      `${ThunkEnum.RemoveAccountById}: removed private key "${account.publicKey}" from storage`
    );

    return account.id;
  }
);

export default removeAccountByIdThunk;

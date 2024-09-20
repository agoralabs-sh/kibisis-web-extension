import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';
import PrivateKeyService from '@extension/services/PrivateKeyService';

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
    let privateKeyService: PrivateKeyService;

    if (!account) {
      logger.debug(
        `${ThunkEnum.RemoveAccountById}: account "${id}" does not exist, ignoring`
      );

      return id;
    }

    logger.debug(
      `${ThunkEnum.RemoveAccountById}: removing account "${id}" from storage`
    );

    // remove the account
    await accountRepository.removeById(account.id);

    privateKeyService = new PrivateKeyService({
      logger,
    });

    logger.debug(
      `${ThunkEnum.RemoveAccountById}: removing private key "${account.publicKey}" from storage`
    );

    // remove the private key
    await privateKeyService.removeFromStorageByPublicKey(account.publicKey);

    return account.id;
  }
);

export default removeAccountByIdThunk;

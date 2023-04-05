import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { ACCOUNT_KEY_PREFIX } from '../../../constants';

// Enums
import { AccountsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { IAccount, ILogger, IMainRootState } from '../../../types';

const setAccount: AsyncThunk<
  IAccount, // return
  IAccount, // args
  Record<string, never>
> = createAsyncThunk<IAccount, IAccount, { state: IMainRootState }>(
  AccountsThunkEnum.SetAccount,
  async (account, { getState }) => {
    const functionName: string = 'setAccount';
    const logger: ILogger = getState().application.logger;
    const storageManager: StorageManager = new StorageManager();

    logger.debug(
      `${functionName}(): saving account "${account.address}" to storage`
    );

    await storageManager.setItems({
      [`${ACCOUNT_KEY_PREFIX}${account.address}`]: account,
    });

    return account;
  }
);

export default setAccount;

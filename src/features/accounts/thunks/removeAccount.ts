import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { ACCOUNT_KEY_PREFIX } from '../../../constants';

// Enums
import { AccountsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { ILogger, IMainRootState } from '../../../types';

const removeAccount: AsyncThunk<
  string, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string, string, { state: IMainRootState }>(
  AccountsThunkEnum.RemoveAccount,
  async (address, { getState }) => {
    const functionName: string = 'removeAccount';
    const logger: ILogger = getState().application.logger;
    const storageManager: StorageManager = new StorageManager();

    logger.debug(`${functionName}(): removing account "${address}" to storage`);

    await storageManager.remove(`${ACCOUNT_KEY_PREFIX}${address}`);

    return address;
  }
);

export default removeAccount;

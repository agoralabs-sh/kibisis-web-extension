import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { ACCOUNT_KEY_PREFIX } from '@extension/constants';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const removeAccountThunk: AsyncThunk<
  string, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string, string, { state: IMainRootState }>(
  AccountsThunkEnum.RemoveAccount,
  async (id, { getState }) => {
    const functionName: string = 'removeAccount';
    const logger: ILogger = getState().application.logger;
    const storageManager: StorageManager = new StorageManager();

    logger.debug(`${functionName}(): removing account "${id}" to storage`);

    await storageManager.remove(`${ACCOUNT_KEY_PREFIX}${id}`);

    return id;
  }
);

export default removeAccountThunk;

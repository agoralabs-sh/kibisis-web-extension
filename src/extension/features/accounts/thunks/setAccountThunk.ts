import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { ACCOUNT_KEY_PREFIX } from '@extension/constants';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState } from '@extension/types';

const setAccountThunk: AsyncThunk<
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
      `${functionName}(): saving account "${account.id}" to storage`
    );

    await storageManager.setItems({
      [`${ACCOUNT_KEY_PREFIX}${account.id}`]: account,
    });

    return account;
  }
);

export default setAccountThunk;

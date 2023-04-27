import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { SESSION_ITEM_KEY_PREFIX } from '@extension/constants';

// Enums
import { SessionsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const removeSessionThunk: AsyncThunk<
  string, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string, string, { state: IMainRootState }>(
  SessionsThunkEnum.RemoveSession,
  async (id, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const storageManager: StorageManager = new StorageManager();

    logger.debug(
      `${removeSessionThunk.name}: removing session "${id}" from storage`
    );

    await storageManager.remove(`${SESSION_ITEM_KEY_PREFIX}${id}`);

    return id;
  }
);

export default removeSessionThunk;

import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { SESSION_ITEM_KEY_PREFIX } from '@extension/constants';

// Enums
import { SessionsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IMainRootState, IStorageItemTypes } from '@extension/types';

const clearSessionsThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  SessionsThunkEnum.ClearSessions,
  async (_, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const storageManager: StorageManager = new StorageManager();
    const storageItems: Record<string, IStorageItemTypes | unknown> =
      await storageManager.getAllItems();
    const sessionKeys: string[] = Object.keys(storageItems).filter((value) =>
      value.includes(SESSION_ITEM_KEY_PREFIX)
    );

    logger.debug(
      `${clearSessionsThunk.name}: clearing ${sessionKeys.length} sessions from storage`
    );

    await storageManager.remove(sessionKeys);
  }
);

export default clearSessionsThunk;

import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { SESSION_KEY_PREFIX } from '../../../constants';

// Enums
import { SessionsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { ILogger, IMainRootState } from '../../../types';

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

    await storageManager.remove(`${SESSION_KEY_PREFIX}${id}`);

    return id;
  }
);

export default removeSessionThunk;

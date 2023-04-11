import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { SESSION_KEY_PREFIX } from '@extension/constants';

// Enums
import { SessionsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IMainRootState, ISession } from '@extension/types';

const setSessionThunk: AsyncThunk<
  ISession, // return
  ISession, // args
  Record<string, never>
> = createAsyncThunk<ISession, ISession, { state: IMainRootState }>(
  SessionsThunkEnum.SetSession,
  async (session, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const storageManager: StorageManager = new StorageManager();

    logger.debug(
      `${SessionsThunkEnum.SetSession}: saving session "${session.id}" to storage`
    );

    await storageManager.setItems({
      [`${SESSION_KEY_PREFIX}${session.id}`]: session,
    });

    return session;
  }
);

export default setSessionThunk;

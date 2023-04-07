import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { SESSION_KEY_PREFIX } from '../../../constants';

// Enums
import { SessionsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { ILogger, IMainRootState, ISession } from '../../../types';

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

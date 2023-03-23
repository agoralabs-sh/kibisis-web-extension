import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { SESSION_KEY_PREFIX } from '../../../constants';

// Enums
import { SessionsThunkEnum } from '../../../enums';

// Features
import fetchSessions from './fetchSessions';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { ILogger, IMainRootState, ISession } from '../../../types';

const saveSession: AsyncThunk<
  void, // return
  ISession, // args
  Record<string, never>
> = createAsyncThunk<void, ISession, { state: IMainRootState }>(
  SessionsThunkEnum.SaveSession,
  async (session, { dispatch, getState }) => {
    const functionName: string = 'saveSession';
    const logger: ILogger = getState().application.logger;
    const storageManager: StorageManager = new StorageManager();

    logger.debug(
      `${functionName}(): saving session "${session.id}" to storage`
    );

    await storageManager.setItems({
      [`${SESSION_KEY_PREFIX}_${session.id}`]: session,
    });

    // refetch sessions
    dispatch(fetchSessions());
  }
);

export default saveSession;

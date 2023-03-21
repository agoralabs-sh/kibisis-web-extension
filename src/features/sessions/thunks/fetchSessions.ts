import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { SESSION_KEY_PREFIX } from '../../../constants';

// Enums
import { SessionsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { IMainRootState, ISession, IStorageItemTypes } from '../../../types';

const fetchSessions: AsyncThunk<
  ISession[], // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<ISession[], undefined, { state: IMainRootState }>(
  SessionsThunkEnum.FetchSessions,
  async () => {
    const storageManager: StorageManager = new StorageManager();
    const storageItems: Record<string, IStorageItemTypes | unknown> =
      await storageManager.getAllItems();

    return Object.keys(storageItems).reduce<ISession[]>(
      (acc, key) =>
        key.startsWith(SESSION_KEY_PREFIX)
          ? [...acc, storageItems[key] as ISession]
          : acc,
      []
    );
  }
);

export default fetchSessions;

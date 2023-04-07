import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Enums
import { ApplicationThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { ILogger, IMainRootState, IStorageItemTypes } from '../../../types';

const clearAllDataThunk: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IMainRootState }>(
  ApplicationThunkEnum.ClearAllData,
  async (_, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const storageManager: StorageManager = new StorageManager();
    const storageItems: Record<string, IStorageItemTypes | unknown> =
      await storageManager.getAllItems();

    logger.debug(`${clearAllDataThunk.name}: clearing all data from storage`);

    // await storageManager.remove(Object.keys(storageItems));
  }
);

export default clearAllDataThunk;

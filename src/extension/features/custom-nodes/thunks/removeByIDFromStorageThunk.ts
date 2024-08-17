import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import CustomNodesService from '@extension/services/CustomNodesService';

// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const removeByIDFromStorageThunk: AsyncThunk<
  ICustomNodeItem[], // return
  string, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  ICustomNodeItem[],
  string,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.RemoveByIDFromStorage, async (id, { getState }) => {
  const logger = getState().system.logger;
  const customNodesService = new CustomNodesService();

  logger.debug(
    `${ThunkEnum.SaveToStorage}: removing custom node item "${id}" from storage`
  );

  // remove the item
  await customNodesService.removeByID(id);

  return await customNodesService.getAll();
});

export default removeByIDFromStorageThunk;

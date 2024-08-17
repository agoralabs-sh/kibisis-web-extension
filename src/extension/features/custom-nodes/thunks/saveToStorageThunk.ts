import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import CustomNodesService from '@extension/services/CustomNodesService';

// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const saveToStorageThunk: AsyncThunk<
  ICustomNodeItem[], // return
  ICustomNodeItem, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  ICustomNodeItem[],
  ICustomNodeItem,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.SaveToStorage, async (item, { getState }) => {
  const logger = getState().system.logger;
  const customNodesService = new CustomNodesService();

  logger.debug(
    `${ThunkEnum.SaveToStorage}: saving custom node item "${item.name}" to storage`
  );

  // save the item
  await customNodesService.save(item);

  return await customNodesService.getAll();
});

export default saveToStorageThunk;

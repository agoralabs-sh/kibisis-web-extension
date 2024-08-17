import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import CustomNodesService from '@extension/services/CustomNodesService';

// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const fetchTransactionParamsFromStorageThunk: AsyncThunk<
  ICustomNodeItem[], // return
  undefined, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  ICustomNodeItem[],
  undefined,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.FetchFromStorage, async (_, { getState }) => {
  const logger = getState().system.logger;
  const customNodesService = new CustomNodesService();

  logger.debug(
    `${ThunkEnum.FetchFromStorage}: fetching custom nodes from storage`
  );

  return await customNodesService.getAll();
});

export default fetchTransactionParamsFromStorageThunk;

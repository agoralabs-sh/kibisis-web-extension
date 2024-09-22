import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// errors
import { MalformedDataError } from '@extension/errors';

// repositories
import SystemInfoRepository from '@extension/repositories/SystemInfoRepository';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const savePolisAccountIDThunk: AsyncThunk<
  string | null, // return
  string, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  string | null,
  string,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.SavePolisAccountID,
  async (value, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const systemInfo = getState().system.info;
    let _error: string;

    if (!systemInfo) {
      _error = 'system info not found';

      logger.debug(`${ThunkEnum.SavePolisAccountID}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    const { polisAccountID } = await new SystemInfoRepository().save({
      ...systemInfo,
      polisAccountID: value,
    });

    return polisAccountID;
  }
);

export default savePolisAccountIDThunk;

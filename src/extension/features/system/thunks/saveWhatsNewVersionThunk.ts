import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// services
import SystemService from '@extension/services/SystemService';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';
import { MalformedDataError } from '@extension/errors';

const saveWhatsNewVersionThunk: AsyncThunk<
  number, // return
  number, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<number, number, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.SaveWhatsNewVersion,
  async (version, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const systemInfo = getState().system.info;
    let _error: string;

    if (!systemInfo) {
      _error = 'system info not found';

      logger.debug(`${ThunkEnum.SaveWhatsNewVersion}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    await new SystemService({
      logger,
    }).saveToStorage({
      ...systemInfo,
      whatsNewVersion: version,
    });

    return version;
  }
);

export default saveWhatsNewVersionThunk;

import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// errors
import { MalformedDataError } from '@extension/errors';

// repositories
import SystemInfoRepository from '@extension/repositories/SystemInfoRepository';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const saveDisableWhatsNewOnUpdateThunk: AsyncThunk<
  boolean, // return
  boolean, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<boolean, boolean, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.SaveDisableWhatsNewOnUpdate,
  async (value, { getState, rejectWithValue }) => {
    const logger = getState().system.logger;
    const systemInfo = getState().system.info;
    let _error: string;

    if (!systemInfo) {
      _error = 'system info not found';

      logger.debug(`${ThunkEnum.SaveDisableWhatsNewOnUpdate}: ${_error}`);

      return rejectWithValue(new MalformedDataError(_error));
    }

    const { whatsNewInfo } = await new SystemInfoRepository().save({
      ...systemInfo,
      whatsNewInfo: {
        ...systemInfo.whatsNewInfo,
        disableOnUpdate: value,
      },
    });

    return whatsNewInfo.disableOnUpdate;
  }
);

export default saveDisableWhatsNewOnUpdateThunk;

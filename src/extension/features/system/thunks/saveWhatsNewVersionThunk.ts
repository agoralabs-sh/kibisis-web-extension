import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// errors
import { MalformedDataError } from '@extension/errors';

// repositories
import SystemInfoRepositoryService from '@extension/repositories/SystemInfoRepositoryService';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const saveWhatsNewVersionThunk: AsyncThunk<
  string | null, // return
  string | null, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  string | null,
  string | null,
  IBaseAsyncThunkConfig<IMainRootState>
>(
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

    const { whatsNewInfo } = await new SystemInfoRepositoryService().save({
      ...systemInfo,
      whatsNewInfo: {
        ...systemInfo.whatsNewInfo,
        version,
      },
    });

    return whatsNewInfo.version;
  }
);

export default saveWhatsNewVersionThunk;

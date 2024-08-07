import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { ThunkEnum } from '../enums';

// types
import type { IBaseAsyncThunkConfig, IMainRootState } from '@extension/types';

const stopPollingForNetworkConnectivityThunk: AsyncThunk<
  void, // return
  undefined, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<void, undefined, IBaseAsyncThunkConfig<IMainRootState>>(
  ThunkEnum.StopPollingForNetworkConnectivity,
  (_, { getState }) => {
    const logger = getState().system.logger;
    const pollingID = getState().system.networkConnectivity.pollingID;

    if (pollingID) {
      logger.debug(
        `${ThunkEnum.StopPollingForNetworkConnectivity}: stopped polling for network transaction params`
      );

      window.clearInterval(pollingID);
    }
  }
);

export default stopPollingForNetworkConnectivityThunk;

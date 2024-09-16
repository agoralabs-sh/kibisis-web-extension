import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchFromStorageThunk,
  saveWhatsNewVersionThunk,
  startPollingForNetworkConnectivityThunk,
  stopPollingForTransactionsParamsThunk,
  updateNetworkConnectivityThunk,
} from './thunks';

// types
import type { ILogger } from '@common/types';
import type { ISystemInfo } from '@extension/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /** fetch from storage **/
    builder.addCase(
      fetchFromStorageThunk.fulfilled,
      (state: IState, action: PayloadAction<ISystemInfo>) => {
        state.info = action.payload;
      }
    );
    /** save what's new version **/
    builder.addCase(
      saveWhatsNewVersionThunk.fulfilled,
      (state: IState, action: PayloadAction<number>) => {
        if (state.info) {
          state.info = {
            ...state.info,
            whatsNewVersion: action.payload,
          };
        }
      }
    );
    /** start polling for network connectivity **/
    builder.addCase(
      startPollingForNetworkConnectivityThunk.fulfilled,
      (state: IState, action: PayloadAction<number>) => {
        state.networkConnectivity.pollingID = action.payload;
      }
    );
    /** stop polling for network connectivity **/
    builder.addCase(
      stopPollingForTransactionsParamsThunk.fulfilled,
      (state: IState) => {
        state.networkConnectivity.pollingID = null;
      }
    );
    /** update network connectivity **/
    builder.addCase(
      updateNetworkConnectivityThunk.fulfilled,
      (state: IState, action: PayloadAction<boolean>) => {
        state.networkConnectivity = {
          ...state.networkConnectivity,
          checking: false,
          online: action.payload,
        };
      }
    );
    builder.addCase(updateNetworkConnectivityThunk.pending, (state: IState) => {
      state.networkConnectivity.checking = true;
    });
    builder.addCase(
      updateNetworkConnectivityThunk.rejected,
      (state: IState) => {
        state.networkConnectivity.checking = false;
      }
    );
  },
  initialState: getInitialState(),
  name: StoreNameEnum.System,
  reducers: {
    setLogger: (state: Draft<IState>, action: PayloadAction<ILogger>) => {
      state.logger = action.payload;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { setLogger } = slice.actions;

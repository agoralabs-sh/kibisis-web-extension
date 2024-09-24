import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { i18n } from 'i18next';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  fetchFromStorageThunk,
  saveDisableWhatsNewOnUpdateThunk,
  savePolisAccountIDThunk,
  saveWhatsNewVersionThunk,
  startPollingForNetworkConnectivityThunk,
  stopPollingForTransactionsParamsThunk,
  updateNetworkConnectivityThunk,
} from './thunks';

// types
import type { ILogger } from '@common/types';
import type { IState } from './types';

// utils
import { getInitialState } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /**fetch from storage**/
    builder.addCase(
      fetchFromStorageThunk.fulfilled,
      (state: IState, action) => {
        state.info = action.payload;
      }
    );
    /**save disable what's on update**/
    builder.addCase(
      saveDisableWhatsNewOnUpdateThunk.fulfilled,
      (state: IState, action) => {
        if (state.info) {
          state.info = {
            ...state.info,
            whatsNewInfo: {
              ...state.info.whatsNewInfo,
              disableOnUpdate: action.payload,
            },
          };
        }
      }
    );
    /**save polis account id**/
    builder.addCase(
      savePolisAccountIDThunk.fulfilled,
      (state: IState, action) => {
        if (state.info) {
          state.info = {
            ...state.info,
            polisAccountID: action.payload,
          };
        }
      }
    );
    /**save what's new version**/
    builder.addCase(
      saveWhatsNewVersionThunk.fulfilled,
      (state: IState, action) => {
        if (state.info) {
          state.info = {
            ...state.info,
            whatsNewInfo: {
              ...state.info.whatsNewInfo,
              version: action.payload,
            },
          };
        }
      }
    );
    /**start polling for network connectivity**/
    builder.addCase(
      startPollingForNetworkConnectivityThunk.fulfilled,
      (state: IState, action) => {
        state.networkConnectivity.pollingID = action.payload;
      }
    );
    /**stop polling for network connectivity**/
    builder.addCase(
      stopPollingForTransactionsParamsThunk.fulfilled,
      (state: IState) => {
        state.networkConnectivity.pollingID = null;
      }
    );
    /**update network connectivity**/
    builder.addCase(
      updateNetworkConnectivityThunk.fulfilled,
      (state: IState, action) => {
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
    setI18nAction: (state: IState, action: PayloadAction<i18n>) => {
      state.i18n = action.payload;
    },
    setLogger: (state: IState, action: PayloadAction<ILogger>) => {
      state.logger = action.payload;
    },
  },
});

export const reducer = slice.reducer;
export const { setI18nAction, setLogger } = slice.actions;

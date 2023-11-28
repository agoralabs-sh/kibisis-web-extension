import { createSlice, Draft, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types';

// enums
import { StoreNameEnum } from '@extension/enums';

// thunks
import {
  clearSessionsThunk,
  fetchSessionsThunk,
  initializeWalletConnectThunk,
  removeAuthorizedAddressThunk,
  removeSessionByIdThunk,
  removeSessionByTopicThunk,
  setSessionThunk,
} from './thunks';

// types
import { ISession } from '@extension/types';
import { IRemoveAuthorizedAddressResult, ISessionsState } from './types';

// utils
import { getInitialState, upsertSessions } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /**clear sessions**/
    builder.addCase(clearSessionsThunk.fulfilled, (state: ISessionsState) => {
      state.items = [];
      state.saving = false;
    });
    builder.addCase(clearSessionsThunk.pending, (state: ISessionsState) => {
      state.saving = true;
    });
    builder.addCase(clearSessionsThunk.rejected, (state: ISessionsState) => {
      state.saving = false;
    });
    /**fetch sessions**/
    builder.addCase(
      fetchSessionsThunk.fulfilled,
      (state: ISessionsState, action: PayloadAction<ISession[]>) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(fetchSessionsThunk.pending, (state: ISessionsState) => {
      state.fetching = true;
    });
    builder.addCase(fetchSessionsThunk.rejected, (state: ISessionsState) => {
      state.fetching = false;
    });
    /**initialize walletconnect**/
    builder.addCase(
      initializeWalletConnectThunk.fulfilled,
      (state: ISessionsState, action: PayloadAction<IWeb3Wallet>) => {
        state.web3Wallet = action.payload;
        state.initializingWalletConnect = false;
      }
    );
    builder.addCase(
      initializeWalletConnectThunk.pending,
      (state: ISessionsState) => {
        state.initializingWalletConnect = true;
      }
    );
    builder.addCase(
      initializeWalletConnectThunk.rejected,
      (state: ISessionsState) => {
        state.initializingWalletConnect = false;
      }
    );
    /**remove authorized address**/
    builder.addCase(
      removeAuthorizedAddressThunk.fulfilled,
      (
        state: ISessionsState,
        action: PayloadAction<IRemoveAuthorizedAddressResult>
      ) => {
        state.items = upsertSessions(state.items, action.payload.update) // update the sessions
          .filter(
            (session) =>
              !action.payload.remove.some((value) => value === session.id)
          ); // filter out the removed sessions
        state.saving = false;
      }
    );
    builder.addCase(
      removeAuthorizedAddressThunk.pending,
      (state: ISessionsState) => {
        state.saving = true;
      }
    );
    builder.addCase(
      removeAuthorizedAddressThunk.rejected,
      (state: ISessionsState) => {
        state.saving = false;
      }
    );
    /**remove session by id**/
    builder.addCase(
      removeSessionByIdThunk.fulfilled,
      (state: ISessionsState, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (value) => value.id !== action.payload
        );
        state.saving = false;
      }
    );
    builder.addCase(removeSessionByIdThunk.pending, (state: ISessionsState) => {
      state.saving = true;
    });
    builder.addCase(
      removeSessionByIdThunk.rejected,
      (state: ISessionsState) => {
        state.saving = false;
      }
    );
    /**remove session by topic**/
    builder.addCase(
      removeSessionByTopicThunk.fulfilled,
      (state: ISessionsState, action: PayloadAction<string | null>) => {
        if (action.payload) {
          state.items = state.items.filter(
            (value) => value.id !== action.payload
          );
        }

        state.saving = false;
      }
    );
    builder.addCase(
      removeSessionByTopicThunk.pending,
      (state: ISessionsState) => {
        state.saving = true;
      }
    );
    builder.addCase(
      removeSessionByTopicThunk.rejected,
      (state: ISessionsState) => {
        state.saving = false;
      }
    );
    /**set session**/
    builder.addCase(
      setSessionThunk.fulfilled,
      (state: ISessionsState, action: PayloadAction<ISession>) => {
        state.items = upsertSessions(state.items, [action.payload]);
        state.saving = false;
      }
    );
    builder.addCase(setSessionThunk.pending, (state: ISessionsState) => {
      state.saving = true;
    });
    builder.addCase(setSessionThunk.rejected, (state: ISessionsState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Sessions,
  reducers: {
    closeWalletConnectModal: (state: Draft<ISessionsState>) => {
      state.walletConnectModalOpen = false;
    },
    openWalletConnectModal: (state: Draft<ISessionsState>) => {
      state.walletConnectModalOpen = true;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { closeWalletConnectModal, openWalletConnectModal } =
  slice.actions;

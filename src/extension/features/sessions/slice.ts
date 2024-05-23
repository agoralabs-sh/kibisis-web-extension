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
import { IRemoveAuthorizedAddressResult, IState } from './types';

// utils
import { getInitialState, upsertSessions } from './utils';

const slice = createSlice({
  extraReducers: (builder) => {
    /**clear sessions**/
    builder.addCase(clearSessionsThunk.fulfilled, (state: IState) => {
      state.items = [];
      state.saving = false;
    });
    builder.addCase(clearSessionsThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(clearSessionsThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /**fetch sessions**/
    builder.addCase(
      fetchSessionsThunk.fulfilled,
      (state: IState, action: PayloadAction<ISession[]>) => {
        state.items = action.payload;
        state.fetching = false;
      }
    );
    builder.addCase(fetchSessionsThunk.pending, (state: IState) => {
      state.fetching = true;
    });
    builder.addCase(fetchSessionsThunk.rejected, (state: IState) => {
      state.fetching = false;
    });
    /**initialize walletconnect**/
    builder.addCase(
      initializeWalletConnectThunk.fulfilled,
      (state: IState, action: PayloadAction<IWeb3Wallet>) => {
        state.web3Wallet = action.payload;
        state.initializingWalletConnect = false;
      }
    );
    builder.addCase(initializeWalletConnectThunk.pending, (state: IState) => {
      state.initializingWalletConnect = true;
    });
    builder.addCase(initializeWalletConnectThunk.rejected, (state: IState) => {
      state.initializingWalletConnect = false;
    });
    /**remove authorized address**/
    builder.addCase(
      removeAuthorizedAddressThunk.fulfilled,
      (
        state: IState,
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
    builder.addCase(removeAuthorizedAddressThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(removeAuthorizedAddressThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /**remove session by id**/
    builder.addCase(
      removeSessionByIdThunk.fulfilled,
      (state: IState, action: PayloadAction<string>) => {
        state.items = state.items.filter(
          (value) => value.id !== action.payload
        );
        state.saving = false;
      }
    );
    builder.addCase(removeSessionByIdThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(removeSessionByIdThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /**remove session by topic**/
    builder.addCase(
      removeSessionByTopicThunk.fulfilled,
      (state: IState, action: PayloadAction<string | null>) => {
        if (action.payload) {
          state.items = state.items.filter(
            (value) => value.id !== action.payload
          );
        }

        state.saving = false;
      }
    );
    builder.addCase(removeSessionByTopicThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(removeSessionByTopicThunk.rejected, (state: IState) => {
      state.saving = false;
    });
    /**set session**/
    builder.addCase(
      setSessionThunk.fulfilled,
      (state: IState, action: PayloadAction<ISession>) => {
        state.items = upsertSessions(state.items, [action.payload]);
        state.saving = false;
      }
    );
    builder.addCase(setSessionThunk.pending, (state: IState) => {
      state.saving = true;
    });
    builder.addCase(setSessionThunk.rejected, (state: IState) => {
      state.saving = false;
    });
  },
  initialState: getInitialState(),
  name: StoreNameEnum.Sessions,
  reducers: {
    closeWalletConnectModal: (state: Draft<IState>) => {
      state.walletConnectModalOpen = false;
    },
    openWalletConnectModal: (state: Draft<IState>) => {
      state.walletConnectModalOpen = true;
    },
  },
});

export const reducer: Reducer = slice.reducer;
export const { closeWalletConnectModal, openWalletConnectModal } =
  slice.actions;

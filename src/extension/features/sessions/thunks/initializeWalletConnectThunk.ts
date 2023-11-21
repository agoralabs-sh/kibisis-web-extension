import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types';

// constants
import { KIBISIS_LINK } from '@extension/constants';

// enums
import { SessionsThunkEnum } from '@extension/enums';

// thunks
import removeSessionByTopicThunk from './removeSessionByTopicThunk';

// types
import { IMainRootState } from '@extension/types';
import { ILogger } from '@common/types';

const initializeWalletConnectThunk: AsyncThunk<
  IWeb3Wallet, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<IWeb3Wallet, undefined, { state: IMainRootState }>(
  SessionsThunkEnum.InitializeWalletConnect,
  async (_, { dispatch, getState }) => {
    const web3Wallet: IWeb3Wallet = await Web3Wallet.init({
      core: new Core({
        projectId: __WALLET_CONNECT_PROJECT_ID__,
      }),
      metadata: {
        name: __APP_TITLE__,
        description: 'Demo Client as Wallet/Peer',
        url: KIBISIS_LINK,
        icons: [],
      },
    });

    // add event listeners
    web3Wallet.on('session_delete', (event) =>
      dispatch(removeSessionByTopicThunk(event.topic))
    );

    return web3Wallet;
  }
);

export default initializeWalletConnectThunk;

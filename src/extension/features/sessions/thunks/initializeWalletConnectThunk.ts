import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';
import { IWeb3Wallet } from '@walletconnect/web3wallet/dist/types';

// Constants
import { KIBISIS_LINK } from '@extension/constants';

// Enums
import { SessionsThunkEnum } from '@extension/enums';

// Thunks
import removeSessionByTopicThunk from './removeSessionByTopicThunk';

// Types
import { IMainRootState } from '@extension/types';
import { ILogger } from '@common/types';

const initializeWalletConnectThunk: AsyncThunk<
  IWeb3Wallet, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<IWeb3Wallet, undefined, { state: IMainRootState }>(
  SessionsThunkEnum.InitializeWalletConnect,
  async (_, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;
    const web3Wallet: IWeb3Wallet = await Web3Wallet.init({
      core: new Core({
        projectId: '86eaff455340651e0ee12c8572c2d228',
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

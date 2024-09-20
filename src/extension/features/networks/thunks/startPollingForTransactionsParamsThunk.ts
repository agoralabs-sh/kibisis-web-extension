import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NETWORK_TRANSACTION_PARAMS_REFRESH_INTERVAL } from '@extension/constants';

// enums
import { ThunkEnum } from '../enums';

// thunks
import updateTransactionParamsForSelectedNetworkThunk from './updateTransactionParamsForSelectedNetworkThunk';

// types
import type { IMainRootState } from '@extension/types';

const startPollingForTransactionsParamsThunk: AsyncThunk<
  number, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<number, undefined, { state: IMainRootState }>(
  ThunkEnum.StartPollingForTransactionParams,
  (_, { dispatch, getState }) => {
    const logger = getState().system.logger;

    logger.debug(
      `${ThunkEnum.StartPollingForTransactionParams}: started polling for network transaction params`
    );

    return window.setInterval(
      () => dispatch(updateTransactionParamsForSelectedNetworkThunk()),
      NETWORK_TRANSACTION_PARAMS_REFRESH_INTERVAL
    ); // update every 30 minutes
  }
);

export default startPollingForTransactionsParamsThunk;

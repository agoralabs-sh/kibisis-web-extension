import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NETWORK_TRANSACTION_PARAMS_REFRESH_INTERVAL } from '@extension/constants';

// enums
import { NetworksThunkEnum } from '@extension/enums';

// thunks
import updateTransactionParamsForSelectedNetworkThunk from './updateTransactionParamsForSelectedNetworkThunk';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const startPollingForTransactionsParamsThunk: AsyncThunk<
  number, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<number, undefined, { state: IMainRootState }>(
  NetworksThunkEnum.StartPollingForTransactionParams,
  (_, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${NetworksThunkEnum.StartPollingForTransactionParams}: started polling for network transaction params`
    );

    return window.setInterval(
      () => dispatch(updateTransactionParamsForSelectedNetworkThunk()),
      NETWORK_TRANSACTION_PARAMS_REFRESH_INTERVAL
    ); // update every 30 minutes
  }
);

export default startPollingForTransactionsParamsThunk;

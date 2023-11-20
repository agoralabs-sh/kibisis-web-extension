import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { ACCOUNT_INFORMATION_REFRESH_INTERVAL } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// Thunks
import updateAccountInformationThunk from './updateAccountInformationThunk';

// types
import { ILogger } from '@common/types';
import { IMainRootState } from '@extension/types';

const startPollingForAccountInformationThunk: AsyncThunk<
  number, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<number, undefined, { state: IMainRootState }>(
  AccountsThunkEnum.StartPollingForAccountInformation,
  (_, { dispatch, getState }) => {
    const logger: ILogger = getState().system.logger;

    logger.debug(
      `${startPollingForAccountInformationThunk.name}: started polling for account information`
    );

    return window.setInterval(
      () => dispatch(updateAccountInformationThunk()),
      ACCOUNT_INFORMATION_REFRESH_INTERVAL
    ); // update every 2 minutes
  }
);

export default startPollingForAccountInformationThunk;

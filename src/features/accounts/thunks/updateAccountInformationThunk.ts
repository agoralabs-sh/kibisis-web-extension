import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Enums
import { AccountsThunkEnum } from '../../../enums';

// Types
import { IAccount, ILogger, IMainRootState, INetwork } from '../../../types';

// Utils
import { updateAccountInformation } from '../utils';

const updateAccountInformationThunk: AsyncThunk<
  IAccount[], // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<IAccount[], undefined, { state: IMainRootState }>(
  AccountsThunkEnum.UpdateAccountInformation,
  async (_, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const accounts: IAccount[] = getState().accounts.items;
    const networks: INetwork[] = getState().networks.items;

    return await updateAccountInformation(accounts, {
      logger,
      networks,
    });
  }
);

export default updateAccountInformationThunk;

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
    const accounts: IAccount[] = getState().accounts.items;
    const logger: ILogger = getState().application.logger;
    const networks: INetwork[] = getState().networks.items;
    const online: boolean = getState().application.online;

    if (!online) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountInformation}: the extension appears to be offline, skipping`
      );

      return accounts;
    }

    return await updateAccountInformation(accounts, {
      logger,
      networks,
    });
  }
);

export default updateAccountInformationThunk;

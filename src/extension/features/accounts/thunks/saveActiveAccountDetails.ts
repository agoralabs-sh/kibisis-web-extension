import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IActiveAccountDetails,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';

const saveActiveAccountDetails: AsyncThunk<
  IActiveAccountDetails | null, // return
  IActiveAccountDetails, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IActiveAccountDetails | null,
  IActiveAccountDetails,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  AccountsThunkEnum.SaveActiveAccountDetails,
  async (activeAccountDetails, { getState }) => {
    const accounts = getState().accounts.items;
    const account =
      accounts.find((value) => value.id === activeAccountDetails.accountId) ||
      null;
    const logger = getState().system.logger;
    let accountService: AccountService;

    if (!account) {
      logger.debug(
        `${AccountsThunkEnum.SaveActiveAccountDetails}: failed to find account "${activeAccountDetails.accountId}", ignoring`
      );

      return null;
    }

    logger.debug(
      `${AccountsThunkEnum.SaveActiveAccountDetails}: saving active account details for account id "${activeAccountDetails.accountId}" to storage`
    );

    accountService = new AccountService({
      logger,
    });

    // save the active account details to storage
    await accountService.saveActiveAccountDetails(activeAccountDetails);

    logger.debug(
      `${AccountsThunkEnum.SaveActiveAccountDetails}: account details for account id "${activeAccountDetails.accountId}" to storage`
    );

    return activeAccountDetails;
  }
);

export default saveActiveAccountDetails;

import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

import { NODE_REQUEST_DELAY } from '@extension/constants';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Services
import { AccountService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, INetwork } from '@extension/types';
import { IFetchAccountsFromStoragePayload } from '../types';

// Utils
import { selectDefaultNetwork } from '@extension/utils';
import { updateAccountInformation } from '../utils';

const fetchAccountsFromStorageThunk: AsyncThunk<
  IAccount[], // return
  IFetchAccountsFromStoragePayload | undefined, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount[],
  IFetchAccountsFromStoragePayload | undefined,
  { state: IMainRootState }
>(AccountsThunkEnum.FetchAccountsFromStorage, async (options, { getState }) => {
  const logger: ILogger = getState().application.logger;
  const networks: INetwork[] = getState().networks.items;
  const online: boolean = getState().application.online;
  const accountService: AccountService = new AccountService({
    logger,
  });
  const selectedNetwork: INetwork | null =
    networks.find(
      (value) =>
        value.genesisHash ===
        getState().settings.general.selectedNetworkGenesisHash
    ) || null;
  let accounts: IAccount[];

  logger.debug(
    `${AccountsThunkEnum.FetchAccountsFromStorage}: fetching accounts from storage`
  );

  accounts = await accountService.getAllAccounts();
  accounts = accounts.sort((a, b) => a.createdAt - b.createdAt); // sort by created at date (oldest first)

  // update account information, if requested
  if (options?.updateAccountInformation && online && selectedNetwork) {
    logger.debug(
      `${AccountsThunkEnum.FetchAccountsFromStorage}: updating account information for "${selectedNetwork.genesisId}"`
    );

    accounts = await Promise.all(
      accounts.map(
        async (account, index) =>
          await updateAccountInformation(account, {
            delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
            logger,
            network: selectedNetwork,
          })
      )
    );

    // save accounts to storage
    accounts = await accountService.saveAccounts(accounts);
  }

  return accounts;
});

export default fetchAccountsFromStorageThunk;

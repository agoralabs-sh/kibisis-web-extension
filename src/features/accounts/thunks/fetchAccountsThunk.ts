import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

import { ACCOUNT_KEY_PREFIX } from '../../../constants';

// Enums
import { AccountsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { IAccount, ILogger, IMainRootState, INetwork } from '../../../types';
import { IFetchAccountsOptions } from '../types';

// Utils
import { selectDefaultNetwork } from '../../../utils';
import { updateAccountInformation } from '../utils';

const fetchAccountsThunk: AsyncThunk<
  IAccount[], // return
  IFetchAccountsOptions | undefined, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount[],
  IFetchAccountsOptions | undefined,
  { state: IMainRootState }
>(AccountsThunkEnum.FetchAccounts, async (options, { getState }) => {
  const logger: ILogger = getState().application.logger;
  const networks: INetwork[] = getState().networks.items;
  const online: boolean = getState().application.online;
  const selectedNetwork: INetwork =
    getState().settings.network || selectDefaultNetwork(networks);
  const storageManager: StorageManager = new StorageManager();
  const storageItems: Record<string, unknown> =
    await storageManager.getAllItems();
  let accounts: IAccount[];

  logger.debug(
    `${AccountsThunkEnum.FetchAccounts}: fetching accounts for "${selectedNetwork.genesisId}" from storage`
  );

  accounts = Object.keys(storageItems)
    .reduce<IAccount[]>(
      (acc, key) =>
        key.startsWith(ACCOUNT_KEY_PREFIX)
          ? [...acc, storageItems[key] as IAccount]
          : acc,
      []
    )
    .filter((value) => value.genesisHash === selectedNetwork.genesisHash); // filter by the selected network

  // update account information, if requested
  if (options?.updateAccountInformation && online) {
    logger.debug(
      `${AccountsThunkEnum.FetchAccounts}: updating account information`
    );

    return await updateAccountInformation(accounts, {
      logger,
      networks,
    });
  }

  return accounts;
});

export default fetchAccountsThunk;

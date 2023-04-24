import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

import { ACCOUNT_KEY_PREFIX, NODE_REQUEST_DELAY } from '@extension/constants';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, INetwork } from '@extension/types';
import { IFetchAccountsPayload } from '../types';

// Utils
import { selectDefaultNetwork } from '@extension/utils';
import { saveAccountsToStorage, updateAccountInformation } from '../utils';

const fetchAccountsThunk: AsyncThunk<
  IAccount[], // return
  IFetchAccountsPayload | undefined, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount[],
  IFetchAccountsPayload | undefined,
  { state: IMainRootState }
>(AccountsThunkEnum.FetchAccounts, async (options, { getState }) => {
  const logger: ILogger = getState().application.logger;
  const networks: INetwork[] = getState().networks.items;
  const online: boolean = getState().application.online;
  const selectedNetwork: INetwork =
    networks.find(
      (value) =>
        value.genesisHash ===
        getState().settings.general.selectedNetworkGenesisHash
    ) || selectDefaultNetwork(networks);
  const storageManager: StorageManager = new StorageManager();
  const storageItems: Record<string, unknown> =
    await storageManager.getAllItems();
  let accounts: IAccount[];

  logger.debug(
    `${fetchAccountsThunk.name}: fetching accounts for "${selectedNetwork.genesisId}" from storage`
  );

  accounts = Object.keys(storageItems)
    .reduce<IAccount[]>(
      (acc, key) =>
        key.startsWith(ACCOUNT_KEY_PREFIX)
          ? [...acc, storageItems[key] as IAccount]
          : acc,
      []
    )
    .filter((value) => value.genesisHash === selectedNetwork.genesisHash) // filter by the selected network
    .sort((a, b) => a.createdAt - b.createdAt); // sort by created at date (oldest first)

  // update account information, if requested
  if (options?.updateAccountInformation && online) {
    logger.debug(`${fetchAccountsThunk.name}: updating account information`);

    accounts = await Promise.all(
      accounts.map(async (account, index) => {
        const network: INetwork | null =
          networks.find((value) => value.genesisHash === account.genesisHash) ||
          null;

        if (!network) {
          logger &&
            logger.debug(
              `${fetchAccountsThunk.name}: unrecognized network "${account.genesisHash}" for "${account.id}", skipping`
            );

          return account;
        }

        return await updateAccountInformation(account, {
          delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          logger,
          network,
        });
      })
    );

    await saveAccountsToStorage(accounts);
  }

  return accounts;
});

export default fetchAccountsThunk;

import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Algodv2, IntDecoding } from 'algosdk';
import { BigNumber } from 'bignumber.js';

import { ACCOUNT_KEY_PREFIX } from '../../../constants';

// Enums
import { AccountsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import {
  IAccount,
  IAlgorandAccountInformation,
  ILogger,
  IMainRootState,
  INetwork,
  INode,
} from '../../../types';
import { IFetchAccountsOptions } from '../types';

// Utils
import { selectDefaultNetwork } from '../../../utils';

const fetchAccounts: AsyncThunk<
  IAccount[], // return
  IFetchAccountsOptions | undefined, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount[],
  IFetchAccountsOptions | undefined,
  { state: IMainRootState }
>(AccountsThunkEnum.FetchAccounts, async (options, { getState }) => {
  const functionName: string = 'fetchAccounts';
  const logger: ILogger = getState().application.logger;
  const networks: INetwork[] = getState().networks.items;
  const selectedNetwork: INetwork =
    getState().settings.network || selectDefaultNetwork(networks);
  const storageManager: StorageManager = new StorageManager();
  const storageItems: Record<string, unknown> =
    await storageManager.getAllItems();
  let accounts: IAccount[] = Object.keys(storageItems)
    .reduce<IAccount[]>(
      (acc, key) =>
        key.startsWith(ACCOUNT_KEY_PREFIX)
          ? [...acc, storageItems[key] as IAccount]
          : acc,
      []
    )
    .filter((value) => value.genesisHash === selectedNetwork.genesisHash); // filter by the selected network
  let client: Algodv2;
  let node: INode;

  // if we are only fetching from storage just return the default values
  if (options && options.onlyFetchFromStorage) {
    logger.debug(`${functionName}(): only fetching accounts from storage`);

    return accounts;
  }

  node =
    selectedNetwork.nodes[
      Math.floor(Math.random() * selectedNetwork.nodes.length)
    ]; // get a random node
  client = new Algodv2('', node.url, node.port);

  accounts = await Promise.all(
    accounts.map(async (account) => {
      let accountInformation: IAlgorandAccountInformation;

      // TODO: only fetch if the updatedAt date is outdated

      try {
        logger.debug(
          `${functionName}(): fetching account information for "${account.address}" from "${node.name}" on "${selectedNetwork.genesisId}"`
        );

        accountInformation = (await client
          .accountInformation(account.address)
          .setIntDecoding(IntDecoding.BIGINT)
          .do()) as IAlgorandAccountInformation;

        logger.debug(
          `${functionName}(): successfully fetched account information for "${account.address}" from "${node.name}" on "${selectedNetwork.genesisId}"`
        );

        return {
          address: account.address,
          atomicBalance: new BigNumber(
            String(accountInformation.amount as bigint)
          ).toString(),
          authAddress: accountInformation['auth-addr'] || null,
          genesisHash: account.genesisHash,
          id: account.id,
          minAtomicBalance: new BigNumber(
            String(accountInformation['min-balance'] as bigint)
          ).toString(),
          name: account.name,
          updatedAt: new Date().getTime(),
        };
      } catch (error) {
        logger.error(
          `${functionName}(): failed to get account information for "${account.address}" from "${node.name}" on ${selectedNetwork.genesisId}: ${error.message}`
        );

        return account;
      }
    })
  );

  // update the storage with the latest account information
  await storageManager.setItems(
    accounts.reduce(
      (acc, value) => ({
        ...acc,
        [`${ACCOUNT_KEY_PREFIX}${value.id}`]: value,
      }),
      {}
    )
  );

  return accounts;
});

export default fetchAccounts;

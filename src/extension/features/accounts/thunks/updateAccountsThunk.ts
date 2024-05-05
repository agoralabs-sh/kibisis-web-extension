import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import AccountService from '@extension/services/AccountService';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';
import { IUpdateAccountsPayload } from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import updateAccountInformation from '@extension/utils/updateAccountInformation';
import updateAccountTransactions from '@extension/utils/updateAccountTransactions';

const updateAccountsThunk: AsyncThunk<
  IAccount[], // return
  IUpdateAccountsPayload | undefined, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount[],
  IUpdateAccountsPayload | undefined,
  { state: IMainRootState }
>(
  AccountsThunkEnum.UpdateAccounts,
  async (
    {
      accountIds,
      forceInformationUpdate,
      informationOnly,
      refreshTransactions,
    } = {
      forceInformationUpdate: false,
      informationOnly: true,
      refreshTransactions: false,
    },
    { getState }
  ) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(networks, getState().settings);
    let accountService: AccountService;
    let accounts: IAccount[] = getState().accounts.items;
    let encodedGenesisHash: string;

    if (!online) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccounts}: the extension appears to be offline, skipping`
      );

      return [];
    }

    if (!selectedNetwork) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccounts}: no network selected, skipping`
      );

      return [];
    }

    // if we have account ids, get all the accounts that match
    if (accountIds) {
      accounts = accounts.filter(
        (account) => !!accountIds.find((value) => value === account.id)
      );
    }

    accountService = new AccountService({
      logger,
    });
    encodedGenesisHash = convertGenesisHashToHex(
      selectedNetwork.genesisHash
    ).toUpperCase();
    accounts = await Promise.all(
      accounts.map(async (account, index) => ({
        ...account,
        networkInformation: {
          ...account.networkInformation,
          [encodedGenesisHash]: await updateAccountInformation({
            address: AccountService.convertPublicKeyToAlgorandAddress(
              account.publicKey
            ),
            currentAccountInformation:
              account.networkInformation[encodedGenesisHash] ||
              AccountService.initializeDefaultAccountInformation(),
            delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
            forceUpdate: forceInformationUpdate,
            logger,
            network: selectedNetwork,
          }),
        },
      }))
    );

    // ignore transaction updates it account information only has been specified
    if (!informationOnly) {
      accounts = await Promise.all(
        accounts.map(async (account, index) => ({
          ...account,
          networkTransactions: {
            ...account.networkTransactions,
            [encodedGenesisHash]: await updateAccountTransactions({
              address: AccountService.convertPublicKeyToAlgorandAddress(
                account.publicKey
              ),
              currentAccountTransactions:
                account.networkTransactions[encodedGenesisHash] ||
                AccountService.initializeDefaultAccountTransactions(),
              delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              logger,
              network: selectedNetwork,
              refresh: refreshTransactions,
            }),
          },
        }))
      );
    }

    // save accounts to storage
    accounts = await accountService.saveAccounts(accounts);

    return accounts;
  }
);

export default updateAccountsThunk;

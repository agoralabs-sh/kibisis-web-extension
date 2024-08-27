import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { ThunkEnum } from '../enums';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccount,
  IAccountWithExtendedProps,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetwork,
} from '@extension/types';
import type { IUpdateAccountsPayload } from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import isWatchAccount from '@extension/utils/isWatchAccount';
import mapAccountWithExtendedPropsToAccount from '@extension/utils/mapAccountWithExtendedPropsToAccount';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';
import updateAccountInformation from '@extension/utils/updateAccountInformation';
import updateAccountTransactions from '@extension/utils/updateAccountTransactions';

const updateAccountsThunk: AsyncThunk<
  IAccountWithExtendedProps[], // return
  IUpdateAccountsPayload | undefined, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps[],
  IUpdateAccountsPayload | undefined,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.UpdateAccounts,
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
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const settings = getState().settings;
    let account: IAccount;
    let accountService: AccountService;
    let accounts = getState().accounts.items.map((value) =>
      mapAccountWithExtendedPropsToAccount(value)
    );
    let encodedGenesisHash: string;
    let network: INetwork | null;
    let nodeID: string | null;

    if (!online) {
      logger.debug(
        `${ThunkEnum.UpdateAccounts}: the extension appears to be offline, skipping`
      );

      return [];
    }

    network = selectNetworkFromSettings({
      networks,
      settings,
    });

    if (!network) {
      logger.debug(
        `${ThunkEnum.UpdateAccounts}: no network selected, skipping`
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
    encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);
    nodeID = selectNodeIDByGenesisHashFromSettings({
      genesisHash: network.genesisHash,
      settings,
    });

    logger.debug(
      `${
        ThunkEnum.UpdateAccounts
      }: updating account information for accounts [${accounts
        .map(({ publicKey }) => convertPublicKeyToAVMAddress(publicKey))
        .join(',')}] for network "${network.genesisId}"`
    );

    for (let i = 0; i < accounts.length; i++) {
      account = {
        ...accounts[i],
        networkInformation: {
          ...accounts[i].networkInformation,
          [encodedGenesisHash]: await updateAccountInformation({
            address: convertPublicKeyToAVMAddress(accounts[i].publicKey),
            currentAccountInformation:
              accounts[i].networkInformation[encodedGenesisHash] ||
              AccountService.initializeDefaultAccountInformation(),
            delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
            forceUpdate: forceInformationUpdate,
            logger,
            network,
            nodeID,
          }),
        },
      };

      accounts = accounts.map((value) =>
        value.id === account.id ? account : value
      );
    }

    // ignore transaction updates if account information only has been specified
    if (!informationOnly) {
      for (let i = 0; i < accounts.length; i++) {
        account = {
          ...accounts[i],
          networkTransactions: {
            ...accounts[i].networkTransactions,
            [encodedGenesisHash]: await updateAccountTransactions({
              address: convertPublicKeyToAVMAddress(accounts[i].publicKey),
              currentAccountTransactions:
                accounts[i].networkTransactions[encodedGenesisHash] ||
                AccountService.initializeDefaultAccountTransactions(),
              delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              logger,
              network,
              nodeID,
              refresh: refreshTransactions,
            }),
          },
        };

        accounts = accounts.map((value) =>
          value.id === account.id ? account : value
        );
      }
    }

    // save accounts to storage
    await accountService.saveAccounts(accounts);

    return await Promise.all(
      accounts.map(async (value) => ({
        ...account,
        watchAccount: await isWatchAccount({ account: value, logger }),
      }))
    );
  }
);

export default updateAccountsThunk;

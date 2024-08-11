import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { ThunkEnum } from '../enums';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountWithExtendedProps,
  IBaseAsyncThunkConfig,
  IMainRootState,
} from '@extension/types';
import type { IUpdateAccountsPayload } from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import isWatchAccount from '@extension/utils/isWatchAccount';
import mapAccountWithExtendedPropsToAccount from '@extension/utils/mapAccountWithExtendedPropsToAccount';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
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
    const network = selectNetworkFromSettings(networks, getState().settings);
    const online = getState().system.networkConnectivity.online;
    let accountService: AccountService;
    let accounts = getState().accounts.items.map((value) =>
      mapAccountWithExtendedPropsToAccount(value)
    );
    let encodedGenesisHash: string;

    if (!online) {
      logger.debug(
        `${ThunkEnum.UpdateAccounts}: the extension appears to be offline, skipping`
      );

      return [];
    }

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

    logger?.debug(
      `${
        ThunkEnum.UpdateAccounts
      }: updating account information for accounts [${accounts
        .map(({ publicKey }) => convertPublicKeyToAVMAddress(publicKey))
        .join(',')}] for network "${network.genesisId}"`
    );

    accounts = await Promise.all(
      accounts.map(async (account, index) => ({
        ...account,
        networkInformation: {
          ...account.networkInformation,
          [encodedGenesisHash]: await updateAccountInformation({
            address: convertPublicKeyToAVMAddress(account.publicKey),
            currentAccountInformation:
              account.networkInformation[encodedGenesisHash] ||
              AccountService.initializeDefaultAccountInformation(),
            delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
            forceUpdate: forceInformationUpdate,
            logger,
            network: network,
          }),
        },
      }))
    );

    // ignore transaction updates it account information only has been specified
    if (!informationOnly) {
      logger?.debug(
        `${
          ThunkEnum.UpdateAccounts
        }: updating account transaction for accounts [${accounts
          .map(({ publicKey }) => convertPublicKeyToAVMAddress(publicKey))
          .join(',')}] for network "${network.genesisId}"`
      );

      accounts = await Promise.all(
        accounts.map(async (account, index) => ({
          ...account,
          networkTransactions: {
            ...account.networkTransactions,
            [encodedGenesisHash]: await updateAccountTransactions({
              address: convertPublicKeyToAVMAddress(account.publicKey),
              currentAccountTransactions:
                account.networkTransactions[encodedGenesisHash] ||
                AccountService.initializeDefaultAccountTransactions(),
              delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              logger,
              network: network,
              refresh: refreshTransactions,
            }),
          },
        }))
      );
    }

    // save accounts to storage
    await accountService.saveAccounts(accounts);

    return await Promise.all(
      accounts.map(async (account) => ({
        ...account,
        watchAccount: await isWatchAccount({ account, logger }),
      }))
    );
  }
);

export default updateAccountsThunk;

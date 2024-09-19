import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { ThunkEnum } from '../enums';

// features
import { create as createNotification } from '@extension/features/notifications';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccount,
  IAccountWithExtendedProps,
  IBackgroundRootState,
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
import serialize from '@extension/utils/serialize';
import updateAccountInformation from '@extension/utils/updateAccountInformation';
import updateAccountTransactions from '@extension/utils/updateAccountTransactions';
import isAccountInformationUpdating from '../utils/isAccountInformationUpdating';
import isAccountTransactionsUpdating from '../utils/isAccountTransactionsUpdating';

const updateAccountsThunk: AsyncThunk<
  IAccountWithExtendedProps[], // return
  IUpdateAccountsPayload, // args
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
> = createAsyncThunk<
  IAccountWithExtendedProps[],
  IUpdateAccountsPayload,
  IBaseAsyncThunkConfig<IBackgroundRootState | IMainRootState>
>(
  ThunkEnum.UpdateAccounts,
  async (
    {
      accountIDs,
      forceInformationUpdate = false,
      information = true,
      notifyOnNewTransactions = false,
      refreshTransactions = false,
      transactions = true,
    },
    { dispatch, getState, requestId }
  ) => {
    const activeAccountDetails = getState().accounts.activeAccountDetails;
    const i18n = getState().system.i18n;
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const settings = getState().settings;
    const updateRequests = getState().accounts.updateRequests;
    let account: IAccount;
    let accountService: AccountService;
    let accounts = getState().accounts.items.map((value) =>
      mapAccountWithExtendedPropsToAccount(value)
    );
    let currentTransactionsLength: number;
    let encodedGenesisHash: string;
    let network: INetwork | null;
    let numberOfNewTransactions: number;
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

    accounts = accounts.filter(
      (account) => !!accountIDs.find((value) => value === account.id)
    );
    accountService = new AccountService({
      logger,
    });
    encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);
    nodeID = selectNodeIDByGenesisHashFromSettings({
      genesisHash: network.genesisHash,
      settings,
    });

    // ignore information update, if the information property is set to false
    if (information) {
      for (let i = 0; i < accounts.length; i++) {
        account = serialize(accounts[i]);

        // if the information is being updated, skip
        if (
          !isAccountInformationUpdating({
            accountID: account.id,
            updateRequests,
            requestID: requestId,
          })
        ) {
          account.networkInformation[encodedGenesisHash] =
            await updateAccountInformation({
              address: convertPublicKeyToAVMAddress(accounts[i].publicKey),
              currentAccountInformation:
                accounts[i].networkInformation[encodedGenesisHash] ||
                AccountService.initializeDefaultAccountInformation(),
              delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              forceUpdate: forceInformationUpdate,
              logger,
              network,
              nodeID,
            });
        }

        accounts = accounts.map((value) =>
          value.id === account.id ? account : value
        );
      }
    }

    // ignore transactions update if the transaction property is set to false
    if (transactions) {
      for (let i = 0; i < accounts.length; i++) {
        account = serialize(accounts[i]);

        // if the transactions are being updated, skip
        if (
          !isAccountTransactionsUpdating({
            accountID: account.id,
            updateRequests,
            requestID: requestId,
          })
        ) {
          currentTransactionsLength =
            account.networkTransactions[encodedGenesisHash]?.transactions
              .length || 0;
          account.networkTransactions[encodedGenesisHash] =
            await updateAccountTransactions({
              address: convertPublicKeyToAVMAddress(accounts[i].publicKey),
              currentAccountTransactions:
                accounts[i].networkTransactions[encodedGenesisHash] ||
                AccountService.initializeDefaultAccountTransactions(),
              delay: i * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              logger,
              network,
              nodeID,
              refresh: refreshTransactions,
            });

          // if it is active account and the there are new transactions, dispatch a notification
          if (
            activeAccountDetails?.accountId === account.id &&
            refreshTransactions &&
            notifyOnNewTransactions
          ) {
            numberOfNewTransactions =
              (account.networkTransactions[encodedGenesisHash]?.transactions
                .length || 0) - currentTransactionsLength;

            if (numberOfNewTransactions > 0 && i18n) {
              dispatch(
                createNotification({
                  description: i18n.t<string>(
                    'captions.newTransactionsReceived',
                    { amount: numberOfNewTransactions }
                  ),
                  ephemeral: true,
                  title: i18n.t<string>('headings.newTransactionsReceived'),
                  type: 'info',
                })
              );
            }
          }
        }

        accounts = accounts.map((value) =>
          value.id === account.id ? account : value
        );
      }
    }

    // save accounts to storage
    accounts = await accountService.saveAccounts(accounts);

    logger.debug(
      `${ThunkEnum.AddStandardAssetHoldings}: saved accounts [${accounts
        .map(({ publicKey }) => `"${convertPublicKeyToAVMAddress(publicKey)}"`)
        .join(',')}] to storage`
    );

    return await Promise.all(
      accounts.map(async (value) => ({
        ...value,
        watchAccount: await isWatchAccount({ account: value, logger }),
      }))
    );
  }
);

export default updateAccountsThunk;

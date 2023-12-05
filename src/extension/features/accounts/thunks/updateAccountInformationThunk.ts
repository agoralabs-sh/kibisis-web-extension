import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import { AccountService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';
import { IUpdateAccountInformationPayload } from '../types';

// utils
import {
  convertGenesisHashToHex,
  selectNetworkFromSettings,
} from '@extension/utils';
import { updateAccountInformation } from '../utils';

const updateAccountInformationThunk: AsyncThunk<
  IAccount[], // return
  IUpdateAccountInformationPayload | undefined, // args
  Record<string, never>
> = createAsyncThunk<
  IAccount[],
  IUpdateAccountInformationPayload | undefined,
  { state: IMainRootState }
>(
  AccountsThunkEnum.UpdateAccountInformation,
  async (
    { accountIds, forceUpdate } = { forceUpdate: false },
    { getState }
  ) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(networks, getState().settings);
    let accountService: AccountService;
    let accounts: IAccount[] = getState().accounts.items;

    if (!online) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountInformation}: the extension appears to be offline, skipping`
      );

      return [];
    }

    if (!selectedNetwork) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountInformation}: no network selected, skipping`
      );

      return [];
    }

    // if we have account ids, get all the accounts that match
    if (accountIds) {
      accounts = accounts.filter(
        (account) => !!accountIds.find((value) => value === account.id)
      );
    }

    accounts = await Promise.all(
      accounts.map(async (account, index) => ({
        ...account,
        networkInformation: {
          ...account.networkInformation,
          [convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()]:
            await updateAccountInformation(account, {
              delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
              forceUpdate,
              logger,
              network: selectedNetwork,
            }),
        },
      }))
    );
    accountService = new AccountService({
      logger,
    });

    // save accounts to storage
    accounts = await accountService.saveAccounts(accounts);

    return accounts;
  }
);

export default updateAccountInformationThunk;

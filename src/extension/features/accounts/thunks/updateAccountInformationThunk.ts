import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import { AccountService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, INetwork } from '@extension/types';

// utils
import {
  convertGenesisHashToHex,
  selectNetworkFromSettings,
} from '@extension/utils';
import { updateAccountInformation } from '../utils';

const updateAccountInformationThunk: AsyncThunk<
  IAccount[], // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<IAccount[], undefined, { state: IMainRootState }>(
  AccountsThunkEnum.UpdateAccountInformation,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetwork | null = selectNetworkFromSettings(
      networks,
      getState().settings
    );
    let accountService: AccountService;
    let accounts: IAccount[] = getState().accounts.items;

    if (!online) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountInformation}: the extension appears to be offline, skipping`
      );

      return accounts;
    }

    if (!selectedNetwork) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountInformation}: no network selected, skipping`
      );

      return accounts;
    }

    logger.debug(
      `${AccountsThunkEnum.UpdateAccountInformation}: updating account information for "${selectedNetwork.genesisId}"`
    );

    accounts = await Promise.all(
      accounts.map(async (account, index) => ({
        ...account,
        networkInformation: {
          ...account.networkInformation,
          [convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()]:
            await updateAccountInformation(account, {
              delay: index * NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
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

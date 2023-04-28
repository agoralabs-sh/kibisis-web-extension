import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Services
import { AccountService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, INetwork } from '@extension/types';

// Utils
import { updateAccountInformation } from '../utils';

const updateAccountInformationThunk: AsyncThunk<
  IAccount[], // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<IAccount[], undefined, { state: IMainRootState }>(
  AccountsThunkEnum.UpdateAccountInformation,
  async (_, { getState }) => {
    const logger: ILogger = getState().application.logger;
    const networks: INetwork[] = getState().networks.items;
    const online: boolean = getState().application.online;
    const selectedNetwork: INetwork | null =
      networks.find(
        (value) =>
          value.genesisHash ===
          getState().settings.general.selectedNetworkGenesisHash
      ) || null;
    let accountService: AccountService;
    let accounts: IAccount[] = getState().accounts.items;

    if (!online) {
      logger.debug(
        `${updateAccountInformationThunk.name}: the extension appears to be offline, skipping`
      );

      return accounts;
    }

    if (!selectedNetwork) {
      logger.debug(
        `${updateAccountInformationThunk.name}: no network selected, skipping`
      );

      return accounts;
    }

    logger.debug(
      `${updateAccountInformationThunk.name}: updating account information for "${selectedNetwork.genesisId}"`
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
    accountService = new AccountService({
      logger,
    });

    // save accounts to storage
    accounts = await accountService.saveAccounts(accounts);

    return accounts;
  }
);

export default updateAccountInformationThunk;

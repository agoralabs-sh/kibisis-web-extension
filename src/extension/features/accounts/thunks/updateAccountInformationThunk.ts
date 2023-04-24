import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// Enums
import { AccountsThunkEnum } from '@extension/enums';

// Types
import { ILogger } from '@common/types';
import { IAccount, IMainRootState, INetwork } from '@extension/types';

// Utils
import { saveAccountsToStorage, updateAccountInformation } from '../utils';

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
    let accounts: IAccount[] = getState().accounts.items;

    if (!online) {
      logger.debug(
        `${AccountsThunkEnum.UpdateAccountInformation}: the extension appears to be offline, skipping`
      );

      return accounts;
    }

    accounts = await Promise.all(
      accounts.map(async (account, index) => {
        const network: INetwork | null =
          networks.find((value) => value.genesisHash === account.genesisHash) ||
          null;

        if (!network) {
          logger &&
            logger.debug(
              `${updateAccountInformation.name}(): unrecognized network "${account.genesisHash}" for "${account.id}", skipping`
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

    return accounts;
  }
);

export default updateAccountInformationThunk;

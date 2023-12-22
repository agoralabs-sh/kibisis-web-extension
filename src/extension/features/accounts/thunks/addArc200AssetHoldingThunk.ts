import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// features
import { updateAccountInformation } from '@extension/features/accounts';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import { AccountService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAccountInformation,
  IBaseAsyncThunkConfig,
  INetwork,
} from '@extension/types';
import { IAddArc200AssetHoldingPayload } from '../types';

// utils
import { convertGenesisHashToHex } from '@extension/utils';

const addArc200AssetHoldingThunk: AsyncThunk<
  IAccount | null, // return
  IAddArc200AssetHoldingPayload, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<
  IAccount | null,
  IAddArc200AssetHoldingPayload,
  IBaseAsyncThunkConfig
>(
  AccountsThunkEnum.AddArc200AssetHolding,
  async ({ accountId, appId, genesisHash }, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const accounts: IAccount[] = getState().accounts.items;
    let account: IAccount | null =
      accounts.find((value) => value.id === accountId) || null;
    let accountService: AccountService;
    let currentAccountInformation: IAccountInformation;
    let encodedGenesisHash: string;
    let network: INetwork | null;

    if (!account) {
      logger.debug(
        `${AccountsThunkEnum.AddArc200AssetHolding}: no account for "${accountId}" found`
      );

      return null;
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      logger.debug(
        `${AccountsThunkEnum.AddArc200AssetHolding}: no network found for "${genesisHash}" found`
      );

      return null;
    }

    encodedGenesisHash = convertGenesisHashToHex(
      network.genesisHash
    ).toUpperCase();
    currentAccountInformation =
      account.networkInformation[encodedGenesisHash] ||
      AccountService.initializeDefaultAccountInformation();

    if (
      currentAccountInformation.arc200AssetHoldings.find(
        (value) => value.id === appId
      )
    ) {
      logger.debug(
        `${AccountsThunkEnum.AddArc200AssetHolding}: arc200 asset "${appId}" has already been added, ignoring`
      );

      return null;
    }

    logger.debug(
      `${AccountsThunkEnum.AddArc200AssetHolding}: adding arc200 asset "${appId}" to account "${account.id}"`
    );

    accountService = new AccountService({
      logger,
    });
    account = {
      ...account,
      networkInformation: {
        ...account.networkInformation,
        [convertGenesisHashToHex(network.genesisHash).toUpperCase()]:
          await updateAccountInformation({
            address: AccountService.convertPublicKeyToAlgorandAddress(
              account.publicKey
            ),
            currentAccountInformation: {
              ...currentAccountInformation,
              arc200AssetHoldings: [
                ...currentAccountInformation.arc200AssetHoldings,
                {
                  amount: '0',
                  id: appId,
                },
              ],
            },
            delay: NODE_REQUEST_DELAY,
            forceUpdate: true,
            logger,
            network,
          }),
      },
    };

    logger.debug(
      `${AccountsThunkEnum.AddArc200AssetHolding}: saving account "${account.id}" to storage`
    );

    // save the account to storage
    await accountService.saveAccounts([account]);

    return account;
  }
);

export default addArc200AssetHoldingThunk;
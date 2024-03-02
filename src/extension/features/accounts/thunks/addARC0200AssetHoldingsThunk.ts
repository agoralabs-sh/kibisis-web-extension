import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// features
import { updateAccountInformation } from '@extension/features/accounts';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAccountInformation,
  IARC0200AssetHolding,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetwork,
} from '@extension/types';
import type { IUpdateARC0200AssetHoldingsPayload } from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import initializeARC0200AssetHoldingFromARC0200Asset from '@extension/utils/initializeARC0200AssetHoldingFromARC0200Asset';

const addARC0200AssetHoldingsThunk: AsyncThunk<
  IAccount | null, // return
  IUpdateARC0200AssetHoldingsPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IAccount | null,
  IUpdateARC0200AssetHoldingsPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  AccountsThunkEnum.AddARC0200AssetHolding,
  async ({ accountId, assets, genesisHash }, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetwork[] = getState().networks.items;
    const accounts: IAccount[] = getState().accounts.items;
    let account: IAccount | null =
      accounts.find((value) => value.id === accountId) || null;
    let accountService: AccountService;
    let currentAccountInformation: IAccountInformation;
    let encodedGenesisHash: string;
    let network: INetwork | null;
    let newAssetHoldings: IARC0200AssetHolding[] = [];

    if (!account) {
      logger.debug(
        `${AccountsThunkEnum.AddARC0200AssetHolding}: no account for "${accountId}" found`
      );

      return null;
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      logger.debug(
        `${AccountsThunkEnum.AddARC0200AssetHolding}: no network found for "${genesisHash}" found`
      );

      return null;
    }

    encodedGenesisHash = convertGenesisHashToHex(
      network.genesisHash
    ).toUpperCase();
    currentAccountInformation =
      account.networkInformation[encodedGenesisHash] ||
      AccountService.initializeDefaultAccountInformation();
    newAssetHoldings = assets
      .filter(
        (asset) =>
          !currentAccountInformation.arc200AssetHoldings.find(
            (value) => value.id === asset.id
          )
      )
      .map(initializeARC0200AssetHoldingFromARC0200Asset);

    accountService = new AccountService({
      logger,
    });
    account = {
      ...account,
      networkInformation: {
        ...account.networkInformation,
        [encodedGenesisHash]: await updateAccountInformation({
          address: AccountService.convertPublicKeyToAlgorandAddress(
            account.publicKey
          ),
          currentAccountInformation: {
            ...currentAccountInformation,
            arc200AssetHoldings: [
              ...currentAccountInformation.arc200AssetHoldings,
              ...newAssetHoldings,
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
      `${AccountsThunkEnum.AddARC0200AssetHolding}: saving account "${account.id}" to storage`
    );

    // save the account to storage
    await accountService.saveAccounts([account]);

    return account;
  }
);

export default addARC0200AssetHoldingsThunk;

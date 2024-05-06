import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// errors
import { MalformedDataError, NetworkNotSelectedError } from '@extension/errors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAccountInformation,
  IARC0200Asset,
  IARC0200AssetHolding,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetwork,
} from '@extension/types';
import type {
  IUpdateAssetHoldingsPayload,
  IUpdateAssetHoldingsResult,
} from '../types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import initializeARC0200AssetHoldingFromARC0200Asset from '@extension/utils/initializeARC0200AssetHoldingFromARC0200Asset';
import updateAccountInformation from '@extension/utils/updateAccountInformation';

const addARC0200AssetHoldingsThunk: AsyncThunk<
  IUpdateAssetHoldingsResult, // return
  IUpdateAssetHoldingsPayload<IARC0200Asset>, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IUpdateAssetHoldingsResult,
  IUpdateAssetHoldingsPayload<IARC0200Asset>,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  AccountsThunkEnum.AddARC0200AssetHoldings,
  async ({ accountId, assets, genesisHash }, { getState, rejectWithValue }) => {
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
        `${AccountsThunkEnum.AddARC0200AssetHoldings}: no account for "${accountId}" found`
      );

      return rejectWithValue(new MalformedDataError('no account found'));
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      logger.debug(
        `${AccountsThunkEnum.AddARC0200AssetHoldings}: no network found for "${genesisHash}" found`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          `attempted to add arc-0200 assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but network "${genesisHash}" not found`
        )
      );
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
      `${AccountsThunkEnum.AddARC0200AssetHoldings}: saving account "${account.id}" to storage`
    );

    // save the account to storage
    await accountService.saveAccounts([account]);

    return {
      account,
    };
  }
);

export default addARC0200AssetHoldingsThunk;

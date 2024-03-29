import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import {
  Algodv2,
  makeAssetTransferTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';
import browser from 'webextension-polyfill';

// contants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// errors
import {
  DecryptionError,
  FailedToSendTransactionError,
  MalformedDataError,
  NetworkNotSelectedError,
  NotAZeroBalanceError,
  NotEnoughMinimumBalanceError,
  OfflineError,
} from '@extension/errors';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAccountInformation,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetworkWithTransactionParams,
  IStandardAsset,
  IStandardAssetHolding,
} from '@extension/types';
import type {
  IUpdateStandardAssetHoldingsPayload,
  IUpdateStandardAssetHoldingsResult,
} from '../types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import calculateMinimumBalanceRequirementForStandardAssets from '@extension/utils/calculateMinimumBalanceRequirementForStandardAssets';
import signAndSendTransactions from '@extension/utils/signAndSendTransactions';
import { updateAccountInformation, updateAccountTransactions } from '../utils';

const removeStandardAssetHoldingsThunk: AsyncThunk<
  IUpdateStandardAssetHoldingsResult, // return
  IUpdateStandardAssetHoldingsPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IUpdateStandardAssetHoldingsResult,
  IUpdateStandardAssetHoldingsPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  AccountsThunkEnum.RemoveStandardAssetHoldings,
  async (
    { accountId, assets, genesisHash, password },
    { getState, rejectWithValue }
  ) => {
    const accounts: IAccount[] = getState().accounts.items;
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const online: boolean = getState().system.online;
    let account: IAccount | null =
      accounts.find((value) => value.id === accountId) || null;
    let accountInformation: IAccountInformation;
    let accountBalanceInAtomicUnits: BigNumber;
    let accountService: AccountService;
    let address: string;
    let algodClient: Algodv2;
    let assetHoldingsAboveZeroBalance: IStandardAssetHolding[];
    let encodedGenesisHash: string;
    let errorMessage: string;
    let filteredAssets: IStandardAsset[];
    let minimumBalanceRequirementInAtomicUnits: BigNumber;
    let network: INetworkWithTransactionParams | null;
    let privateKey: Uint8Array | null;
    let privateKeyService: PrivateKeyService;
    let transactionIds: string[];
    let suggestedParams: SuggestedParams;
    let unsignedTransactions: Transaction[];

    if (!account) {
      logger.debug(
        `${AccountsThunkEnum.RemoveStandardAssetHoldings}: no account for "${accountId}" found`
      );

      return rejectWithValue(new MalformedDataError('no account found'));
    }

    if (!online) {
      logger.debug(
        `${AccountsThunkEnum.RemoveStandardAssetHoldings}: extension offline`
      );

      return rejectWithValue(
        new OfflineError(
          `attempted to remove standard assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but extension offline`
        )
      );
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      logger.debug(
        `${AccountsThunkEnum.RemoveStandardAssetHoldings}: no network found for "${genesisHash}" found`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          `attempted to remove standard assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but network "${genesisHash}" not found`
        )
      );
    }

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
    address = AccountService.convertPublicKeyToAlgorandAddress(
      account.publicKey
    );

    try {
      privateKey = await privateKeyService.getDecryptedPrivateKey(
        AccountService.decodePublicKey(account.publicKey),
        password
      );

      if (!privateKey) {
        errorMessage = `failed to get private key for account "${address}"`;

        logger.debug(
          `${AccountsThunkEnum.RemoveStandardAssetHoldings}: ${errorMessage}`
        );

        return rejectWithValue(new DecryptionError(errorMessage));
      }
    } catch (error) {
      logger.error(`${AccountsThunkEnum.RemoveStandardAssetHoldings}:`, error);

      return rejectWithValue(error);
    }

    accountInformation =
      AccountService.extractAccountInformationForNetwork(account, network) ||
      AccountService.initializeDefaultAccountInformation();
    filteredAssets = assets.filter((asset) =>
      accountInformation.standardAssetHoldings.some(
        (value) => value.id === asset.id
      )
    );
    accountBalanceInAtomicUnits = new BigNumber(
      accountInformation.atomicBalance
    );
    minimumBalanceRequirementInAtomicUnits =
      calculateMinimumBalanceRequirementForStandardAssets({
        account,
        network,
        numOfStandardAssets: -filteredAssets.length,
      }).plus(
        new BigNumber(network.minFee).multipliedBy(filteredAssets.length)
      ); // current minimum account balance + minimum balance requirement of the removed assets + the transaction fees of each remove asset transaction

    // if the account balance is below the minimum required for adding a standard asset, error
    if (
      accountBalanceInAtomicUnits.lt(minimumBalanceRequirementInAtomicUnits)
    ) {
      errorMessage = `the required minimum balance to remove assets [${filteredAssets
        .map(({ id }) => `"${id}"`)
        .join(
          ','
        )}] is "${minimumBalanceRequirementInAtomicUnits}", but the current balance is "${accountBalanceInAtomicUnits}"`;

      logger.debug(
        `${AccountsThunkEnum.RemoveStandardAssetHoldings}: ${errorMessage}`
      );

      return rejectWithValue(new NotEnoughMinimumBalanceError(errorMessage));
    }

    // check that the asset holdings are zero
    assetHoldingsAboveZeroBalance =
      accountInformation.standardAssetHoldings.filter(
        (assetHolding) =>
          filteredAssets.some((value) => value.id === assetHolding.id) &&
          new BigNumber(assetHolding.amount).gt(0)
      );

    if (assetHoldingsAboveZeroBalance.length > 0) {
      errorMessage = `assets [${assetHoldingsAboveZeroBalance
        .map(({ id }) => `"${id}"`)
        .join(',')}] do not have a zero balance`;

      logger.debug(
        `${AccountsThunkEnum.RemoveStandardAssetHoldings}: ${errorMessage}`
      );

      return rejectWithValue(new NotAZeroBalanceError(errorMessage));
    }

    algodClient = createAlgodClient(network, {
      logger,
    });

    try {
      suggestedParams = await algodClient.getTransactionParams().do();
      unsignedTransactions = filteredAssets.map((value) =>
        makeAssetTransferTxnWithSuggestedParams(
          address,
          address,
          address,
          undefined,
          0,
          undefined,
          parseInt(value.id),
          suggestedParams
        )
      );

      logger.debug(
        `${
          AccountsThunkEnum.RemoveStandardAssetHoldings
        }: sending opt-out transactions to the network for assets [${filteredAssets
          .map(({ id }) => `"${id}"`)
          .join(',')}]`
      );

      transactionIds = await signAndSendTransactions({
        logger,
        network,
        privateKey,
        unsignedTransactions,
      });
    } catch (error) {
      logger.debug(`${AccountsThunkEnum.RemoveStandardAssetHoldings}: `, error);

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }

    encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);
    accountService = new AccountService({
      logger,
    });
    account = {
      ...account,
      networkInformation: {
        ...account.networkInformation,
        [encodedGenesisHash]: await updateAccountInformation({
          address,
          currentAccountInformation: accountInformation,
          delay: NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          forceUpdate: true,
          logger,
          network,
        }),
      },
      networkTransactions: {
        ...account.networkTransactions,
        [encodedGenesisHash]: await updateAccountTransactions({
          address,
          currentAccountTransactions:
            account.networkTransactions[encodedGenesisHash] ||
            AccountService.initializeDefaultAccountTransactions(),
          delay: NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
          logger,
          network,
          refresh: true,
        }),
      },
    };

    logger.debug(
      `${AccountsThunkEnum.RemoveStandardAssetHoldings}: saving account "${account.id}" to storage`
    );

    // save the account to storage
    await accountService.saveAccounts([account]);

    return {
      account,
      transactionIds,
    };
  }
);

export default removeStandardAssetHoldingsThunk;

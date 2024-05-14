import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import {
  Algodv2,
  makeAssetTransferTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
} from 'algosdk';
import BigNumber from 'bignumber.js';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { AccountsThunkEnum } from '@extension/enums';

// errors
import {
  BaseExtensionError,
  FailedToSendTransactionError,
  MalformedDataError,
  NetworkNotSelectedError,
  NotEnoughMinimumBalanceError,
  OfflineError,
} from '@extension/errors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccountInformation,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';
import type {
  IUpdateStandardAssetHoldingsPayload,
  IUpdateStandardAssetHoldingsResult,
} from '../types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import calculateMinimumBalanceRequirementForStandardAssets from '@extension/utils/calculateMinimumBalanceRequirementForStandardAssets';
import isWatchAccount from '@extension/utils/isWatchAccount';
import signAndSendTransactions from '@extension/utils/signAndSendTransactions';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import updateAccountInformation from '@extension/utils/updateAccountInformation';
import updateAccountTransactions from '@extension/utils/updateAccountTransactions';
import { findAccountWithoutExtendedProps } from '../utils';

const addStandardAssetHoldingsThunk: AsyncThunk<
  IUpdateStandardAssetHoldingsResult, // return
  IUpdateStandardAssetHoldingsPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IUpdateStandardAssetHoldingsResult,
  IUpdateStandardAssetHoldingsPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  AccountsThunkEnum.AddStandardAssetHoldings,
  async (
    { accountId, assets, genesisHash, password },
    { getState, rejectWithValue }
  ) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.online;
    let account = findAccountWithoutExtendedProps(accountId, accounts);
    let accountBalanceInAtomicUnits: BigNumber;
    let accountInformation: IAccountInformation;
    let accountService: AccountService;
    let address: string;
    let algodClient: Algodv2;
    let encodedGenesisHash: string;
    let errorMessage: string;
    let filteredAssets: IStandardAsset[];
    let minimumBalanceRequirementInAtomicUnits: BigNumber;
    let network: INetworkWithTransactionParams | null;
    let suggestedParams: SuggestedParams;
    let transactionIds: string[];
    let unsignedTransactions: Transaction[];

    if (!account) {
      logger.debug(
        `${AccountsThunkEnum.AddStandardAssetHoldings}: no account for "${accountId}" found`
      );

      return rejectWithValue(new MalformedDataError('no account found'));
    }

    if (!online) {
      logger.debug(
        `${AccountsThunkEnum.AddStandardAssetHoldings}: extension offline`
      );

      return rejectWithValue(
        new OfflineError(
          `attempted to add standard assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but extension offline`
        )
      );
    }

    network =
      networks.find((value) => value.genesisHash === genesisHash) || null;

    if (!network) {
      logger.debug(
        `${AccountsThunkEnum.AddStandardAssetHoldings}: no network found for "${genesisHash}" found`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          `attempted to add standard assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but network "${genesisHash}" not found`
        )
      );
    }

    address = AccountService.convertPublicKeyToAlgorandAddress(
      account.publicKey
    );
    accountInformation =
      AccountService.extractAccountInformationForNetwork(account, network) ||
      AccountService.initializeDefaultAccountInformation();
    filteredAssets = assets.filter(
      (
        asset // get all the
      ) =>
        !accountInformation.standardAssetHoldings.some(
          (value) => value.id === asset.id
        )
    );
    accountBalanceInAtomicUnits = new BigNumber(
      accountInformation?.atomicBalance || '0'
    );
    minimumBalanceRequirementInAtomicUnits =
      calculateMinimumBalanceRequirementForStandardAssets({
        account,
        network,
        numOfStandardAssets: filteredAssets.length,
      }).plus(
        new BigNumber(network.minFee).multipliedBy(filteredAssets.length)
      ); // current minimum account balance + minimum balance required to add the asset + the transaction fee

    // throw an error if the account balance is below the minimum required for adding the standard assets
    if (
      accountBalanceInAtomicUnits.lt(minimumBalanceRequirementInAtomicUnits)
    ) {
      errorMessage = `the required minimum balance to add assets [${assets
        .map(({ id }) => `"${id}"`)
        .join(
          ','
        )}] is "${minimumBalanceRequirementInAtomicUnits}", but the current balance is "${accountBalanceInAtomicUnits}"`;

      logger.debug(
        `${AccountsThunkEnum.AddStandardAssetHoldings}: ${errorMessage}`
      );

      return rejectWithValue(new NotEnoughMinimumBalanceError(errorMessage));
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
          undefined,
          undefined,
          0,
          undefined,
          parseInt(value.id),
          suggestedParams
        )
      );

      logger.debug(
        `${
          AccountsThunkEnum.AddStandardAssetHoldings
        }: sending opt-in transactions to the network for assets [${filteredAssets
          .map(({ id }) => `"${id}"`)
          .join(',')}]`
      );

      transactionIds = await signAndSendTransactions({
        logger,
        network,
        password,
        unsignedTransactions,
      });
    } catch (error) {
      logger.debug(`${AccountsThunkEnum.AddStandardAssetHoldings}: `, error);

      if ((error as BaseExtensionError).code) {
        return rejectWithValue(error);
      }

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
      `${AccountsThunkEnum.AddStandardAssetHoldings}: saving account "${account.id}" to storage`
    );

    // save the account to storage
    await accountService.saveAccounts([account]);

    return {
      account: {
        ...account,
        watchAccount: await isWatchAccount({ account, logger }),
      },
      transactionIds,
    };
  }
);

export default addStandardAssetHoldingsThunk;

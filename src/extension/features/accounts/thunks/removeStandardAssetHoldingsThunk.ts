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
import { ThunkEnum } from '../enums';

// errors
import {
  BaseExtensionError,
  FailedToSendTransactionError,
  MalformedDataError,
  NetworkNotSelectedError,
  NotAZeroBalanceError,
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
  IStandardAssetHolding,
} from '@extension/types';
import type {
  TUpdateStandardAssetHoldingsPayload,
  IUpdateStandardAssetHoldingsResult,
} from '../types';

// utils
import createAlgodClientFromSettings from '@common/utils/createAlgodClientFromSettings';
import calculateMinimumBalanceRequirementForStandardAssets from '@extension/utils/calculateMinimumBalanceRequirementForStandardAssets';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import isWatchAccount from '@extension/utils/isWatchAccount';
import sendTransactionsForNetwork from '@extension/utils/sendTransactionsForNetwork';
import signTransaction from '@extension/utils/signTransaction';
import updateAccountInformation from '@extension/utils/updateAccountInformation';
import updateAccountTransactions from '@extension/utils/updateAccountTransactions';
import { findAccountWithoutExtendedProps } from '../utils';

const removeStandardAssetHoldingsThunk: AsyncThunk<
  IUpdateStandardAssetHoldingsResult, // return
  TUpdateStandardAssetHoldingsPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IUpdateStandardAssetHoldingsResult,
  TUpdateStandardAssetHoldingsPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.RemoveStandardAssetHoldings,
  async (
    { accountId, assets, genesisHash, ...encryptionOptions },
    { getState, rejectWithValue }
  ) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    let account = findAccountWithoutExtendedProps(accountId, accounts);
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
    let transactionIds: string[];
    let signedTransactions: Uint8Array[];
    let suggestedParams: SuggestedParams;
    let unsignedTransactions: Transaction[];

    if (!account) {
      logger.debug(
        `${ThunkEnum.RemoveStandardAssetHoldings}: no account for "${accountId}" found`
      );

      return rejectWithValue(new MalformedDataError('no account found'));
    }

    if (!online) {
      logger.debug(
        `${ThunkEnum.RemoveStandardAssetHoldings}: extension offline`
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
        `${ThunkEnum.RemoveStandardAssetHoldings}: no network found for "${genesisHash}" found`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          `attempted to remove standard assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but network "${genesisHash}" not found`
        )
      );
    }

    address = convertPublicKeyToAVMAddress(account.publicKey);
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

      logger.debug(`${ThunkEnum.RemoveStandardAssetHoldings}: ${errorMessage}`);

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

      logger.debug(`${ThunkEnum.RemoveStandardAssetHoldings}: ${errorMessage}`);

      return rejectWithValue(new NotAZeroBalanceError(errorMessage));
    }

    algodClient = createAlgodClientFromNetwork(network);

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
          ThunkEnum.RemoveStandardAssetHoldings
        }: sending opt-out transactions to the network for assets [${filteredAssets
          .map(({ id }) => `"${id}"`)
          .join(',')}]`
      );

      signedTransactions = await Promise.all(
        unsignedTransactions.map((value) =>
          signTransaction({
            accounts,
            authAccounts: accounts,
            logger,
            networks,
            unsignedTransaction: value,
            ...encryptionOptions,
          })
        )
      );
      transactionIds = unsignedTransactions.map((value) => value.txID());

      await sendTransactionsForNetwork({
        logger,
        network,
        signedTransactions,
      });
    } catch (error) {
      logger.debug(`${ThunkEnum.RemoveStandardAssetHoldings}: `, error);

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
      `${ThunkEnum.RemoveStandardAssetHoldings}: saving account "${account.id}" to storage`
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

export default removeStandardAssetHoldingsThunk;

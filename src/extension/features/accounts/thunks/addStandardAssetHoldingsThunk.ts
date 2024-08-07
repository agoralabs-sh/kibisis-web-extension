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
  NotEnoughMinimumBalanceError,
  OfflineError,
} from '@extension/errors';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccountInformation,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetworkWithTransactionParams,
  IStandardAsset,
} from '@extension/types';
import type {
  IUpdateStandardAssetHoldingsResult,
  TUpdateStandardAssetHoldingsPayload,
} from '../types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import calculateMinimumBalanceRequirementForStandardAssets from '@extension/utils/calculateMinimumBalanceRequirementForStandardAssets';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import isWatchAccount from '@extension/utils/isWatchAccount';
import sendTransactionsForNetwork from '@extension/utils/sendTransactionsForNetwork';
import signTransaction from '@extension/utils/signTransaction';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import updateAccountInformation from '@extension/utils/updateAccountInformation';
import updateAccountTransactions from '@extension/utils/updateAccountTransactions';
import { findAccountWithoutExtendedProps } from '../utils';

const addStandardAssetHoldingsThunk: AsyncThunk<
  IUpdateStandardAssetHoldingsResult, // return
  TUpdateStandardAssetHoldingsPayload, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  IUpdateStandardAssetHoldingsResult,
  TUpdateStandardAssetHoldingsPayload,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.AddStandardAssetHoldings,
  async (
    { accountId, assets, genesisHash, ...encryptionOptions },
    { getState, rejectWithValue }
  ) => {
    const accounts = getState().accounts.items;
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.online;
    let _error: string;
    let account = findAccountWithoutExtendedProps(accountId, accounts);
    let accountBalanceInAtomicUnits: BigNumber;
    let accountInformation: IAccountInformation;
    let accountService: AccountService;
    let address: string;
    let algodClient: Algodv2;
    let encodedGenesisHash: string;
    let filteredAssets: IStandardAsset[];
    let minimumBalanceRequirementInAtomicUnits: BigNumber;
    let network: INetworkWithTransactionParams | null;
    let signedTransactions: Uint8Array[];
    let suggestedParams: SuggestedParams;
    let transactionIds: string[];
    let unsignedTransactions: Transaction[];

    if (!account) {
      logger.debug(
        `${ThunkEnum.AddStandardAssetHoldings}: no account for "${accountId}" found`
      );

      return rejectWithValue(new MalformedDataError('no account found'));
    }

    if (!online) {
      logger.debug(`${ThunkEnum.AddStandardAssetHoldings}: extension offline`);

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
        `${ThunkEnum.AddStandardAssetHoldings}: no network found for "${genesisHash}" found`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          `attempted to add standard assets [${assets
            .map(({ id }) => `"${id}"`)
            .join(',')}], but network "${genesisHash}" not found`
        )
      );
    }

    address = convertPublicKeyToAVMAddress(
      PrivateKeyService.decode(account.publicKey)
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
      _error = `the required minimum balance to add assets [${assets
        .map(({ id }) => `"${id}"`)
        .join(
          ','
        )}] is "${minimumBalanceRequirementInAtomicUnits}", but the current balance is "${accountBalanceInAtomicUnits}"`;

      logger.debug(`${ThunkEnum.AddStandardAssetHoldings}: ${_error}`);

      return rejectWithValue(new NotEnoughMinimumBalanceError(_error));
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
          ThunkEnum.AddStandardAssetHoldings
        }: sending opt-in transactions to the network for assets [${filteredAssets
          .map(({ id }) => `"${id}"`)
          .join(',')}]`
      );

      signedTransactions = await Promise.all(
        unsignedTransactions.map((value) =>
          signTransaction({
            ...encryptionOptions,
            accounts,
            authAccounts: accounts,
            logger,
            networks,
            unsignedTransaction: value,
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
      logger.debug(`${ThunkEnum.AddStandardAssetHoldings}: `, error);

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
      `${ThunkEnum.AddStandardAssetHoldings}: saving account "${account.id}" to storage`
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

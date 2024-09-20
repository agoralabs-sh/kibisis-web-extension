import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import {
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

// models
import NetworkClient from '@extension/models/NetworkClient';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';
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
import calculateMinimumBalanceRequirementForStandardAssets from '@extension/utils/calculateMinimumBalanceRequirementForStandardAssets';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import isWatchAccount from '@extension/utils/isWatchAccount';
import signTransaction from '@extension/utils/signTransaction';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import updateAccountInformation from '@extension/utils/updateAccountInformation';
import updateAccountTransactions from '@extension/utils/updateAccountTransactions';
import { findAccountWithoutExtendedProps } from '../utils';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';
import serialize from '@extension/utils/serialize';

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
    const online = getState().system.networkConnectivity.online;
    const settings = getState().settings;
    let _error: string;
    let account = serialize(
      findAccountWithoutExtendedProps(accountId, accounts)
    );
    let accountBalanceInAtomicUnits: BigNumber;
    let accountInformation: IAccountInformation;
    let accountRepository: AccountRepository;
    let address: string;
    let encodedGenesisHash: string;
    let filteredAssets: IStandardAsset[];
    let minimumBalanceRequirementInAtomicUnits: BigNumber;
    let network: INetworkWithTransactionParams | null;
    let networkClient: NetworkClient;
    let nodeID: string | null;
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
      AccountRepository.extractAccountInformationForNetwork(account, network) ||
      AccountRepository.initializeDefaultAccountInformation();
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

    networkClient = new NetworkClient({ logger, network });
    nodeID = selectNodeIDByGenesisHashFromSettings({
      genesisHash: network.genesisHash,
      settings,
    });

    try {
      suggestedParams = await networkClient.suggestedParams(nodeID);
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

      await networkClient.sendTransactions({
        nodeID,
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
    accountRepository = new AccountRepository();
    account.networkInformation[encodedGenesisHash] =
      await updateAccountInformation({
        address,
        currentAccountInformation: accountInformation,
        delay: NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
        forceUpdate: true,
        logger,
        network,
        nodeID,
      });
    account.networkTransactions[encodedGenesisHash] =
      await updateAccountTransactions({
        address,
        currentAccountTransactions:
          account.networkTransactions[encodedGenesisHash] ||
          AccountRepository.initializeDefaultAccountTransactions(),
        delay: NODE_REQUEST_DELAY, // delay each request by 100ms from the last one, see https://algonode.io/api/#limits
        logger,
        network,
        nodeID,
        refresh: true,
      });

    // save the account to storage
    await accountRepository.save([account]);

    logger.debug(
      `${ThunkEnum.AddStandardAssetHoldings}: saved account "${account.id}" to storage`
    );

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

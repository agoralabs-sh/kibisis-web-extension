import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import {
  Address,
  Algodv2,
  decodeAddress,
  IntDecoding,
  makeAssetTransferTxnWithSuggestedParams,
  SuggestedParams,
  Transaction,
  waitForConfirmation,
} from 'algosdk';
import BigNumber from 'bignumber.js';
import browser from 'webextension-polyfill';

// enums
import { AddAssetThunkEnum, AssetTypeEnum } from '@extension/enums';

// errors
import {
  DecryptionError,
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
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAccountInformation,
  IAlgorandPendingTransactionResponse,
  IAssetTypes,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import calculateMinimumBalanceRequirementForStandardAssets from '@extension/utils/calculateMinimumBalanceRequirementForStandardAssets';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

const addStandardAssetThunk: AsyncThunk<
  string | null, // return
  string, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  string | null,
  string,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  AddAssetThunkEnum.AddStandardAsset,
  async (password, { getState, rejectWithValue }) => {
    const accountId: string | null = getState().addAsset.accountId;
    const account: IAccount | null =
      getState().accounts.items.find((value) => value.id === accountId) || null;
    const asset: IAssetTypes | null = getState().addAsset.selectedAsset;
    const logger: ILogger = getState().system.logger;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(getState().networks.items, getState().settings);
    let accountBalanceInAtomicUnits: BigNumber;
    let accountInformation: IAccountInformation | null;
    let address: string;
    let algodClient: Algodv2;
    let decodedAddress: Address;
    let errorMessage: string;
    let minimumBalanceRequirementInAtomicUnits: BigNumber;
    let privateKey: Uint8Array | null;
    let privateKeyService: PrivateKeyService;
    let sentRawTransaction: { txId: string };
    let signedTransactionData: Uint8Array;
    let suggestedParams: SuggestedParams;
    let transactionResponse: IAlgorandPendingTransactionResponse;
    let unsignedTransaction: Transaction;

    if (!accountId || !account) {
      logger.debug(
        `${AddAssetThunkEnum.AddStandardAsset}: no account found for "${accountId}"`
      );

      return rejectWithValue(new MalformedDataError('no account found'));
    }

    if (!asset || asset.type !== AssetTypeEnum.Standard) {
      logger.debug(
        `${AddAssetThunkEnum.AddStandardAsset}: no standard asset selected`
      );

      return rejectWithValue(
        new MalformedDataError('no asset or asset is not a standard asset')
      );
    }

    if (!online) {
      logger.debug(`${AddAssetThunkEnum.AddStandardAsset}: extension offline`);

      return rejectWithValue(
        new OfflineError(
          `attempted to add asset standard asset "${asset.id}", but extension offline`
        )
      );
    }

    if (!selectedNetwork) {
      logger.debug(
        `${AddAssetThunkEnum.AddStandardAsset}: no network selected`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          'attempted to add asset standard asset "${asset.id}", but no network selected'
        )
      );
    }

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    try {
      address = AccountService.convertPublicKeyToAlgorandAddress(
        account.publicKey
      );
      decodedAddress = decodeAddress(address);
      privateKey = await privateKeyService.getDecryptedPrivateKey(
        decodedAddress.publicKey,
        password
      );

      if (!privateKey) {
        return rejectWithValue(
          new DecryptionError(
            `failed to get private key for signer "${address}"`
          )
        );
      }
    } catch (error) {
      logger.debug(`${AddAssetThunkEnum.AddStandardAsset}(): ${error.message}`);

      return rejectWithValue(error);
    }

    accountInformation = AccountService.extractAccountInformationForNetwork(
      account,
      selectedNetwork
    );
    accountBalanceInAtomicUnits = new BigNumber(
      accountInformation?.atomicBalance || '0'
    );
    minimumBalanceRequirementInAtomicUnits =
      calculateMinimumBalanceRequirementForStandardAssets({
        account,
        network: selectedNetwork,
      }).plus(new BigNumber(selectedNetwork.minFee)); // current minimum account balance + minimum balance required to add the asset + the transaction fee

    // if the account balance is below the minimum required for adding a standard asset, error
    if (
      accountBalanceInAtomicUnits.lt(minimumBalanceRequirementInAtomicUnits)
    ) {
      errorMessage = `the required minimum balance to add asset "${asset.id}" is "${minimumBalanceRequirementInAtomicUnits}", but the current balance is "${accountBalanceInAtomicUnits}"`;

      logger.debug(`${AddAssetThunkEnum.AddStandardAsset}: ${errorMessage}`);

      return rejectWithValue(new NotEnoughMinimumBalanceError(errorMessage));
    }

    algodClient = createAlgodClient(selectedNetwork, {
      logger,
    });

    try {
      suggestedParams = await algodClient.getTransactionParams().do();
      unsignedTransaction = makeAssetTransferTxnWithSuggestedParams(
        address,
        address,
        undefined,
        undefined,
        0,
        undefined,
        parseInt(asset.id),
        suggestedParams
      );
      signedTransactionData = unsignedTransaction.signTxn(privateKey);

      logger.debug(
        `${AddAssetThunkEnum.AddStandardAsset}: sending opt-in transaction to the network`
      );

      sentRawTransaction = await algodClient
        .sendRawTransaction(signedTransactionData)
        .setIntDecoding(IntDecoding.BIGINT)
        .do();

      logger.debug(
        `${AddAssetThunkEnum.AddStandardAsset}: opt-in transaction "${sentRawTransaction.txId}" sent to the network, confirming`
      );

      transactionResponse = (await waitForConfirmation(
        algodClient,
        sentRawTransaction.txId,
        4
      )) as IAlgorandPendingTransactionResponse;

      logger.debug(
        `${AddAssetThunkEnum.AddStandardAsset}: opt-in transaction "${sentRawTransaction.txId}" confirmed in round "${transactionResponse['confirmed-round']}"`
      );

      // on success, return the transaction id
      return sentRawTransaction.txId;
    } catch (error) {
      logger.debug(`${AddAssetThunkEnum.AddStandardAsset}(): ${error.message}`);

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default addStandardAssetThunk;

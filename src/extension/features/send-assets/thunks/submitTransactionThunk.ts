import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import {
  Address,
  Algodv2,
  decodeAddress,
  IntDecoding,
  SuggestedParams,
  Transaction,
  waitForConfirmation,
} from 'algosdk';
import browser from 'webextension-polyfill';

// enums
import { SendAssetsThunkEnum } from '@extension/enums';

// errors
import {
  BaseExtensionError,
  DecryptionError,
  FailedToSendTransactionError,
  MalformedDataError,
  NetworkNotSelectedError,
  OfflineError,
} from '@extension/errors';

// services
import { AccountService, PrivateKeyService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAlgorandPendingTransactionResponse,
  IStandardAsset,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import { getAlgodClient } from '@common/utils';
import { selectNetworkFromSettings } from '@extension/utils';
import { createSendAssetTransaction } from '../utils';

interface AsyncThunkConfig {
  state: IMainRootState;
  rejectValue?: BaseExtensionError;
}

const submitTransactionThunk: AsyncThunk<
  string, // return
  string, // args
  AsyncThunkConfig
> = createAsyncThunk<string, string, AsyncThunkConfig>(
  SendAssetsThunkEnum.SubmitTransaction,
  async (password, { getState, rejectWithValue }) => {
    const amount: string | null = getState().sendAssets.amount;
    const asset: IStandardAsset | null = getState().sendAssets.selectedAsset;
    const fromAddress: string | null = getState().sendAssets.fromAddress;
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const online: boolean = getState().system.online;
    const note: string | null = getState().sendAssets.note;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(networks, getState().settings);
    const toAddress: string | null = getState().sendAssets.toAddress;
    let fromAccount: IAccount | null;
    let algodClient: Algodv2;
    let decodedAddress: Address;
    let privateKey: Uint8Array | null;
    let privateKeyService: PrivateKeyService;
    let sentRawTransaction: { txId: string };
    let signedTransactionData: Uint8Array;
    let suggestedParams: SuggestedParams;
    let transactionResponse: IAlgorandPendingTransactionResponse;
    let unsignedTransaction: Transaction;

    if (!amount || !asset || !fromAddress || !toAddress) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: required fields not completed`
      );

      return rejectWithValue(new MalformedDataError('required fields missing'));
    }

    fromAccount =
      getState().accounts.items.find(
        (value) =>
          AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
          fromAddress
      ) || null;

    if (!fromAccount) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: no account found for "${fromAddress}"`
      );

      return rejectWithValue(
        new MalformedDataError(
          `no account data found for "${fromAddress}" in wallet`
        )
      );
    }

    if (!online) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: extension offline`
      );

      return rejectWithValue(
        new OfflineError('attempted to send transaction, but extension offline')
      );
    }

    if (!selectedNetwork) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: no network selected`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          'attempted to send transaction, but no network selected'
        )
      );
    }

    privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });

    try {
      decodedAddress = decodeAddress(fromAddress);
      privateKey = await privateKeyService.getDecryptedPrivateKey(
        decodedAddress.publicKey,
        password
      );

      if (!privateKey) {
        return rejectWithValue(
          new DecryptionError(
            `failed to get private key for signer "${fromAddress}"`
          )
        );
      }
    } catch (error) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}(): ${error.message}`
      );

      return rejectWithValue(error);
    }

    algodClient = getAlgodClient(selectedNetwork, {
      logger,
    });

    try {
      suggestedParams = await algodClient.getTransactionParams().do();
      unsignedTransaction = createSendAssetTransaction({
        amount,
        asset,
        fromAddress,
        note,
        suggestedParams,
        toAddress,
      });
      signedTransactionData = unsignedTransaction.signTxn(privateKey);

      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: sending transaction to the network`
      );

      sentRawTransaction = await algodClient
        .sendRawTransaction(signedTransactionData)
        .setIntDecoding(IntDecoding.BIGINT)
        .do();

      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: transaction "${sentRawTransaction.txId}" sent to the network, confirming`
      );

      transactionResponse = (await waitForConfirmation(
        algodClient,
        sentRawTransaction.txId,
        4
      )) as IAlgorandPendingTransactionResponse;

      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: transaction "${sentRawTransaction.txId}" confirmed in round "${transactionResponse['confirmed-round']}"`
      );

      // on success, return the transaction id
      return sentRawTransaction.txId;
    } catch (error) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}(): ${error.message}`
      );

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default submitTransactionThunk;

import { CreateToastFnReturn } from '@chakra-ui/react';
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

// features
import {
  updateAccountInformationThunk,
  updateAccountTransactionsForAccountThunk,
} from '@extension/features/accounts';
import { reset } from '../slice';

// services
import { AccountService, PrivateKeyService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAlgorandPendingTransactionResponse,
  IAsset,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import { getAlgodClient } from '@common/utils';
import { ellipseAddress, selectNetworkFromSettings } from '@extension/utils';
import { createSendAssetTransaction } from '../utils';

const submitTransactionThunk: AsyncThunk<
  BaseExtensionError | null, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<
  BaseExtensionError | null,
  string,
  { state: IMainRootState }
>(
  SendAssetsThunkEnum.SubmitTransaction,
  async (password, { dispatch, getState }) => {
    const amount: string | null = getState().sendAssets.amount;
    const asset: IAsset | null = getState().sendAssets.selectedAsset;
    const fromAddress: string | null = getState().sendAssets.fromAddress;
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const online: boolean = getState().system.online;
    const note: string | null = getState().sendAssets.note;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(networks, getState().settings);
    const toAddress: string | null = getState().sendAssets.toAddress;
    const toast: CreateToastFnReturn | null = getState().system.toast;
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

      return new MalformedDataError('required fields missing');
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

      return new MalformedDataError(
        `no account data found for "${fromAddress}" in wallet`
      );
    }

    if (!online) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: extension offline`
      );

      if (toast) {
        toast({
          description: `You appear to be offline.`,
          isClosable: true,
          status: 'error',
          title: 'Offline',
        });
      }

      return new OfflineError(
        'attempted to send transaction, but extension offline'
      );
    }

    if (!selectedNetwork) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}: no network selected`
      );

      return new NetworkNotSelectedError(
        'attempted to send transaction, but no network selected'
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
        throw new DecryptionError(
          `failed to get private key for signer "${fromAddress}"`
        );
      }
    } catch (error) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}(): ${error.message}`
      );

      return error;
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

      if (toast) {
        toast({
          description: `Transaction "${ellipseAddress(
            sentRawTransaction.txId
          )}" successful!`,
          duration: null,
          isClosable: true,
          status: 'success',
          title: 'Transaction Successful!',
        });
      }

      // refresh the account information and account transactions
      dispatch(
        updateAccountInformationThunk({
          forceUpdate: true,
        })
      );
      dispatch(
        updateAccountTransactionsForAccountThunk({
          accountId: fromAccount.id,
          refresh: true,
        })
      );

      // reset send assets to close the modal.
      dispatch(reset());

      return null;
    } catch (error) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}(): ${error.message}`
      );

      if (toast) {
        toast({
          description: `Failed to send the transaction to the network.`,
          isClosable: true,
          status: 'error',
          title: 'Transaction Failure',
        });
      }

      return new FailedToSendTransactionError(error.message);
    }
  }
);

export default submitTransactionThunk;

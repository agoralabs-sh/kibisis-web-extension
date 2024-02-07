import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Address, Algodv2, decodeAddress, SuggestedParams } from 'algosdk';
import BigNumber from 'bignumber.js';
import browser from 'webextension-polyfill';

// enums
import { AssetTypeEnum, SendAssetsThunkEnum } from '@extension/enums';

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
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAssetTypes,
  IAsyncThunkConfigWithRejectValue,
  INativeCurrency,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import convertToAtomicUnit from '@common/utils/convertToAtomicUnit';
import getAlgodClient from '@common/utils/getAlgodClient';
import getIndexerClient from '@common/utils/getIndexerClient';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import {
  sendArc200AssetTransferTransaction,
  sendPaymentTransaction,
  sendStandardAssetTransferTransaction,
} from '../utils';

const submitTransactionThunk: AsyncThunk<
  string, // return
  string, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  string,
  string,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(
  SendAssetsThunkEnum.SubmitTransaction,
  async (password, { getState, rejectWithValue }) => {
    const amountInStandardUnits: string =
      getState().sendAssets.amountInStandardUnits.length > 0
        ? getState().sendAssets.amountInStandardUnits
        : '0';
    const asset: IAssetTypes | INativeCurrency | null =
      getState().sendAssets.selectedAsset;
    const fromAddress: string | null = getState().sendAssets.fromAddress;
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const online: boolean = getState().system.online;
    const network: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(networks, getState().settings);
    const note: string | null = getState().sendAssets.note;
    const toAddress: string | null = getState().sendAssets.toAddress;
    let amount: string;
    let fromAccount: IAccount | null;
    let algodClient: Algodv2;
    let decodedAddress: Address;
    let privateKey: Uint8Array | null;
    let privateKeyService: PrivateKeyService;
    let suggestedParams: SuggestedParams;

    if (!asset || !fromAddress || !toAddress) {
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

    if (!network) {
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

    algodClient = getAlgodClient(network, {
      logger,
    });

    try {
      amount = convertToAtomicUnit(
        new BigNumber(amountInStandardUnits),
        asset.decimals
      ).toString(); // convert to atomic units
      suggestedParams = await algodClient.getTransactionParams().do();

      switch (asset.type) {
        case AssetTypeEnum.Arc200:
          return await sendArc200AssetTransferTransaction({
            algodClient,
            amount,
            asset,
            fromAddress,
            indexerClient: getIndexerClient(network, { logger }),
            logger,
            note,
            privateKey,
            toAddress,
          });
        case AssetTypeEnum.Standard:
          return sendStandardAssetTransferTransaction({
            algodClient,
            amount,
            asset,
            fromAddress,
            logger,
            note,
            privateKey,
            suggestedParams,
            toAddress,
          });
        case AssetTypeEnum.Native:
          return sendPaymentTransaction({
            algodClient,
            amount,
            fromAddress,
            logger,
            note,
            privateKey,
            suggestedParams,
            toAddress,
          });
        default:
          throw new Error('unknown asset');
      }
    } catch (error) {
      logger.debug(
        `${SendAssetsThunkEnum.SubmitTransaction}(): ${error.message}`
      );

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default submitTransactionThunk;

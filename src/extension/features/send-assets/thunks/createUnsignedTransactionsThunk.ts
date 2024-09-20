import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { type Transaction } from 'algosdk';
import BigNumber from 'bignumber.js';

// enums
import { AssetTypeEnum, SendAssetsThunkEnum } from '@extension/enums';

// errors
import {
  FailedToSendTransactionError,
  MalformedDataError,
  NetworkNotSelectedError,
  OfflineError,
} from '@extension/errors';

// services
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';

// types
import type {
  IAccountInformation,
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';
import type { ICreateUnsignedTransactionsPayload } from '../types';

// utils
import convertToAtomicUnit from '@common/utils/convertToAtomicUnit';
import createUnsignedARC0200TransferTransactions from '@extension/utils/createUnsignedARC0200TransferTransactions';
import createUnsignedPaymentTransactions from '@extension/utils/createUnsignedPaymentTransactions';
import createUnsignedStandardAssetTransferTransactions from '@extension/utils/createUnsignedStandardAssetTransferTransactions';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

const createUnsignedTransactionsThunk: AsyncThunk<
  Transaction[], // return
  ICreateUnsignedTransactionsPayload, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  Transaction[],
  ICreateUnsignedTransactionsPayload,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(
  SendAssetsThunkEnum.CreateUnsignedTransactions,
  async (
    { amountInStandardUnits, note, receiverAddress },
    { getState, rejectWithValue }
  ) => {
    const asset = getState().sendAssets.asset;
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const sender = getState().sendAssets.sender;
    const settings = getState().settings;
    let _error: string;
    let amountInAtomicUnits: string;
    let network: INetworkWithTransactionParams | null;
    let nodeID: string | null;
    let senderAccountInformation: IAccountInformation | null;
    let senderAddress: string;

    if (!asset || !sender) {
      _error = 'required fields not completed';

      logger.debug(
        `${SendAssetsThunkEnum.CreateUnsignedTransactions}: ${_error}`
      );

      return rejectWithValue(new MalformedDataError(_error));
    }

    if (!online) {
      logger.debug(
        `${SendAssetsThunkEnum.CreateUnsignedTransactions}: extension offline`
      );

      return rejectWithValue(
        new OfflineError('attempted to send transaction, but extension offline')
      );
    }

    network = selectNetworkFromSettings({
      networks,
      settings,
    });

    if (!network) {
      logger.debug(
        `${SendAssetsThunkEnum.CreateUnsignedTransactions}: no network selected`
      );

      return rejectWithValue(
        new NetworkNotSelectedError(
          'attempted to send transaction, but no network selected'
        )
      );
    }

    senderAccountInformation =
      AccountRepositoryService.extractAccountInformationForNetwork(
        sender,
        network
      );
    senderAddress = convertPublicKeyToAVMAddress(sender.publicKey);

    if (!senderAccountInformation) {
      _error = `no account information found for "${senderAddress}" on network "${network.genesisId}"`;

      logger.debug(
        `${SendAssetsThunkEnum.CreateUnsignedTransactions}: ${_error}`
      );

      return rejectWithValue(new MalformedDataError(_error));
    }

    nodeID = selectNodeIDByGenesisHashFromSettings({
      genesisHash: network.genesisHash,
      settings,
    });

    try {
      amountInAtomicUnits = convertToAtomicUnit(
        new BigNumber(amountInStandardUnits),
        asset.decimals
      ).toString(); // convert to atomic units

      switch (asset.type) {
        case AssetTypeEnum.ARC0200:
          return await createUnsignedARC0200TransferTransactions({
            amountInAtomicUnits,
            asset,
            authAddress: senderAccountInformation.authAddress,
            fromAddress: senderAddress,
            logger,
            network,
            nodeID,
            note: note || null,
            toAddress: receiverAddress,
          });
        case AssetTypeEnum.Standard:
          return await createUnsignedStandardAssetTransferTransactions({
            amountInAtomicUnits,
            asset,
            fromAddress: senderAddress,
            logger,
            network,
            nodeID,
            note: note || null,
            toAddress: receiverAddress,
          });
        case AssetTypeEnum.Native:
          return await createUnsignedPaymentTransactions({
            amountInAtomicUnits,
            fromAddress: senderAddress,
            logger,
            network,
            nodeID,
            note: note || null,
            toAddress: receiverAddress,
          });
        default:
          throw new Error('unknown asset');
      }
    } catch (error) {
      logger.debug(
        `${SendAssetsThunkEnum.CreateUnsignedTransactions}: `,
        error
      );

      return rejectWithValue(new FailedToSendTransactionError(error.message));
    }
  }
);

export default createUnsignedTransactionsThunk;

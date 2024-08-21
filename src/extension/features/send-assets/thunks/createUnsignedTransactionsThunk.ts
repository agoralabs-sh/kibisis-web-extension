import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from 'algosdk';
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
import AccountService from '@extension/services/AccountService';

// types
import type {
  IAccount,
  IAccountInformation,
  IAsyncThunkConfigWithRejectValue,
  IMainRootState,
} from '@extension/types';

// utils
import convertToAtomicUnit from '@common/utils/convertToAtomicUnit';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import createUnsignedARC0200TransferTransactions from '@extension/utils/createUnsignedARC0200TransferTransactions';
import createUnsignedPaymentTransactions from '@extension/utils/createUnsignedPaymentTransactions';
import createUnsignedStandardAssetTransferTransactions from '@extension/utils/createUnsignedStandardAssetTransferTransactions';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import selectCustomNodeFromSettings from '@extension/utils/selectCustomNodeFromSettings';

const createUnsignedTransactionsThunk: AsyncThunk<
  Transaction[], // return
  undefined, // args
  IAsyncThunkConfigWithRejectValue<IMainRootState>
> = createAsyncThunk<
  Transaction[],
  undefined,
  IAsyncThunkConfigWithRejectValue<IMainRootState>
>(
  SendAssetsThunkEnum.CreateUnsignedTransactions,
  async (_, { getState, rejectWithValue }) => {
    const amountInStandardUnits =
      getState().sendAssets.amountInStandardUnits.length > 0
        ? getState().sendAssets.amountInStandardUnits
        : '0';
    const asset = getState().sendAssets.selectedAsset;
    const customNodes = getState().customNodes.items;
    const fromAddress = getState().sendAssets.fromAddress;
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const settings = getState().settings;
    const customNode = selectCustomNodeFromSettings({
      customNodes,
      settings,
    });
    const network = selectNetworkFromSettings({
      networks,
      settings,
    });
    const note = getState().sendAssets.note;
    const toAddress = getState().sendAssets.toAddress;
    let _error: string;
    let fromAccountInformation: IAccountInformation | null;
    let amountInAtomicUnits: string;
    let fromAccount: IAccount | null;

    if (!asset || !fromAddress || !toAddress) {
      _error = 'required fields not completed';

      logger.debug(
        `${SendAssetsThunkEnum.CreateUnsignedTransactions}: ${_error}`
      );

      return rejectWithValue(new MalformedDataError(_error));
    }

    fromAccount =
      getState().accounts.items.find(
        (value) => convertPublicKeyToAVMAddress(value.publicKey) === fromAddress
      ) || null;

    if (!fromAccount) {
      _error = `no account found for "${fromAddress}"`;

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

    fromAccountInformation = AccountService.extractAccountInformationForNetwork(
      fromAccount,
      network
    );

    if (!fromAccountInformation) {
      _error = `no account information found for "${fromAddress}" on network "${network.genesisId}"`;

      logger.debug(
        `${SendAssetsThunkEnum.CreateUnsignedTransactions}: ${_error}`
      );

      return rejectWithValue(new MalformedDataError(_error));
    }

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
            authAddress: fromAccountInformation.authAddress,
            customNode,
            fromAddress,
            logger,
            network,
            note,
            toAddress,
          });
        case AssetTypeEnum.Standard:
          return await createUnsignedStandardAssetTransferTransactions({
            amountInAtomicUnits,
            asset,
            customNodeOrNetwork: customNode || network,
            fromAddress,
            logger,
            note,
            toAddress,
          });
        case AssetTypeEnum.Native:
          return await createUnsignedPaymentTransactions({
            amountInAtomicUnits,
            customNodeOrNetwork: customNode || network,
            fromAddress,
            logger,
            note,
            toAddress,
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

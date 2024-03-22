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
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import createUnsignedARC0200TransferTransactions from '@extension/utils/createUnsignedARC0200TransferTransactions';
import createUnsignedPaymentTransactions from '@extension/utils/createUnsignedPaymentTransactions';
import createUnsignedStandardAssetTransferTransactions from '@extension/utils/createUnsignedStandardAssetTransferTransactions';

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
    let amountInAtomicUnits: string;
    let fromAccount: IAccount | null;

    if (!asset || !fromAddress || !toAddress) {
      logger.debug(
        `${SendAssetsThunkEnum.CreateUnsignedTransactions}: required fields not completed`
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
        `${SendAssetsThunkEnum.CreateUnsignedTransactions}: no account found for "${fromAddress}"`
      );

      return rejectWithValue(
        new MalformedDataError(
          `no account data found for "${fromAddress}" in wallet`
        )
      );
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
            fromAddress,
            logger,
            network,
            note,
            toAddress,
          });
        case AssetTypeEnum.Native:
          return await createUnsignedPaymentTransactions({
            amountInAtomicUnits,
            fromAddress,
            logger,
            network,
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

import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import {
  NETWORK_TRANSACTION_PARAMS_ANTIQUATED_TIMEOUT,
  NETWORK_TRANSACTION_PARAMS_ITEM_KEY_PREFIX,
} from '@extension/constants';

// enums
import { ThunkEnum } from '../enums';

// services
import StorageManager from '@extension/services/StorageManager';

// types
import type {
  IAlgorandTransactionParams,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import transactionParams from '@extension/utils/transactionParams';

const updateTransactionParamsForSelectedNetworkThunk: AsyncThunk<
  INetworkWithTransactionParams | null, // return
  undefined, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  INetworkWithTransactionParams | null,
  undefined,
  IBaseAsyncThunkConfig<IMainRootState>
>(
  ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk,
  async (_, { getState }) => {
    const algodNode = getState().networks.algod;
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const settings = getState().settings;
    const storageManager: StorageManager = new StorageManager();
    let avmTransactionParams: IAlgorandTransactionParams;
    let network: INetworkWithTransactionParams | null;
    let updatedAt: Date;

    if (!online) {
      logger.debug(
        `${ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: the extension appears to be offline, skipping`
      );

      return null;
    }

    network = selectNetworkFromSettings({
      networks,
      settings,
    });

    if (!network) {
      logger.debug(
        `${ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: no network selected, skipping`
      );

      return null;
    }

    if (!algodNode) {
      logger.debug(
        `${ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: no algod node selected, skipping`
      );

      return network;
    }

    if (
      network.updatedAt &&
      network.updatedAt + NETWORK_TRANSACTION_PARAMS_ANTIQUATED_TIMEOUT >
        new Date().getTime()
    ) {
      logger?.debug(
        `${
          ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk
        }: last updated "${new Date(network.updatedAt).toString()}", skipping`
      );

      return network;
    }

    try {
      avmTransactionParams = await transactionParams({
        algodNode,
        logger,
      });
    } catch (error) {
      logger?.error(
        `${ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: failed to get transaction params for network "${network.genesisId}":`,
        error
      );

      return network;
    }

    logger.debug(
      `${ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: saving updated transaction params for network "${network.genesisId}" to storage`
    );

    // check if the genesis hashes match
    if (avmTransactionParams['genesis-hash'] !== network.genesisHash) {
      logger?.debug(
        `${ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: requested network genesis hash "${network.genesisHash}" does not match the returned genesis hash "${avmTransactionParams['genesis-hash']}", ignoring`
      );

      return network;
    }

    updatedAt = new Date();

    logger?.debug(
      `${
        ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk
      }: successfully updated transaction params for network "${
        network.genesisId
      }" at "${updatedAt.toString()}"`
    );

    network = {
      ...network,
      fee: avmTransactionParams.fee.toString(),
      minFee: avmTransactionParams['min-fee'].toString(),
      updatedAt: updatedAt.getTime(),
    };

    // save the updated params to storage
    await storageManager.setItems({
      [`${NETWORK_TRANSACTION_PARAMS_ITEM_KEY_PREFIX}${convertGenesisHashToHex(
        network.genesisHash
      )}`]: {
        fee: network.fee,
        minFee: network.minFee,
        updatedAt: network.updatedAt,
      },
    });

    return network;
  }
);

export default updateTransactionParamsForSelectedNetworkThunk;

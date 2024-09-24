import { type AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NETWORK_TRANSACTION_PARAMS_ANTIQUATED_TIMEOUT } from '@extension/constants';

// enums
import { ThunkEnum } from '../enums';

// models
import NetworkClient from '@extension/models/NetworkClient';

// repositories
import NetworksRepository from '@extension/repositories/NetworksRepository';

// types
import type {
  IAlgorandTransactionParams,
  IBaseAsyncThunkConfig,
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';

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
    const logger = getState().system.logger;
    const networks = getState().networks.items;
    const online = getState().system.networkConnectivity.online;
    const settings = getState().settings;
    let avmTransactionParams: IAlgorandTransactionParams;
    let networkClient: NetworkClient;
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

    if (
      network.updatedAt &&
      network.updatedAt + NETWORK_TRANSACTION_PARAMS_ANTIQUATED_TIMEOUT >
        new Date().getTime()
    ) {
      logger.debug(
        `${
          ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk
        }: last updated "${new Date(network.updatedAt).toString()}", skipping`
      );

      return network;
    }

    networkClient = new NetworkClient({ logger, network });

    try {
      avmTransactionParams = await networkClient.transactionParams(
        selectNodeIDByGenesisHashFromSettings({
          genesisHash: network.genesisHash,
          settings,
        })
      );
    } catch (error) {
      logger.error(
        `${ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: failed to get transaction params for network "${network.genesisId}":`,
        error
      );

      return network;
    }

    // check if the genesis hashes match
    if (avmTransactionParams['genesis-hash'] !== network.genesisHash) {
      logger.debug(
        `${ThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: requested network genesis hash "${network.genesisHash}" does not match the returned genesis hash "${avmTransactionParams['genesis-hash']}", ignoring`
      );

      return network;
    }

    updatedAt = new Date();

    logger.debug(
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
    return await new NetworksRepository().save({
      ...network,
      fee: avmTransactionParams.fee.toString(),
      minFee: avmTransactionParams['min-fee'].toString(),
      updatedAt: updatedAt.getTime(),
    });
  }
);

export default updateTransactionParamsForSelectedNetworkThunk;

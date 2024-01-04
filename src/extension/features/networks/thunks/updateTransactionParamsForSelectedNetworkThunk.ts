import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import { NETWORK_TRANSACTION_PARAMS_ITEM_KEY_PREFIX } from '@extension/constants';

// enums
import { NetworksThunkEnum } from '@extension/enums';

// services
import StorageManager from '@extension/services/StorageManager';

// types
import { ILogger } from '@common/types';
import {
  IMainRootState,
  INetworkWithTransactionParams,
} from '@extension/types';

// utils
import {
  convertGenesisHashToHex,
  selectNetworkFromSettings,
} from '@extension/utils';
import { updateTransactionParams } from '@extension/features/networks';

const updateTransactionParamsForSelectedNetworkThunk: AsyncThunk<
  INetworkWithTransactionParams | null, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<
  INetworkWithTransactionParams | null,
  undefined,
  { state: IMainRootState }
>(
  NetworksThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk,
  async (_, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const online: boolean = getState().system.online;
    const selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(networks, getState().settings);
    const storageManager: StorageManager = new StorageManager();
    let updatedNetwork: INetworkWithTransactionParams;

    if (!online) {
      logger.debug(
        `${NetworksThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: the extension appears to be offline, skipping`
      );

      return null;
    }

    if (!selectedNetwork) {
      logger.debug(
        `${NetworksThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: no network selected, skipping`
      );

      return null;
    }

    updatedNetwork = await updateTransactionParams(selectedNetwork, {
      logger,
    });

    logger.debug(
      `${NetworksThunkEnum.UpdateTransactionParamsForSelectedNetworkThunk}: saving updated transaction params for network "${selectedNetwork.genesisId}" to storage`
    );

    // save the updated params to storage
    await storageManager.setItems({
      [`${NETWORK_TRANSACTION_PARAMS_ITEM_KEY_PREFIX}${convertGenesisHashToHex(
        updatedNetwork.genesisHash
      ).toUpperCase()}`]: {
        fee: updatedNetwork.fee,
        minFee: updatedNetwork.minFee,
        updatedAt: updatedNetwork.updatedAt,
      },
    });

    return updatedNetwork;
  }
);

export default updateTransactionParamsForSelectedNetworkThunk;

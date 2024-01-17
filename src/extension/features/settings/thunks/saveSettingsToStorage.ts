import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { NetworkTypeEnum, SettingsThunkEnum } from '@extension/enums';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import { ILogger } from '@common/types';
import {
  IMainRootState,
  INetworkWithTransactionParams,
  ISettings,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

const saveSettingsToStorage: AsyncThunk<
  ISettings, // return
  ISettings, // args
  Record<string, never>
> = createAsyncThunk<ISettings, ISettings, { state: IMainRootState }>(
  SettingsThunkEnum.SaveSettingsToStorage,
  async (settings, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const settingsService: SettingsService = new SettingsService({
      logger,
    });
    let selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(networks, settings);
    console.log(settings.advanced);

    // if the beta/main-net has been disallowed and the selected network is one of the disallowed, set it to a test one
    if (
      !selectedNetwork ||
      (!settings.advanced.allowBetaNet &&
        selectedNetwork.type === NetworkTypeEnum.Beta) ||
      (!settings.advanced.allowMainNet &&
        selectedNetwork.type === NetworkTypeEnum.Stable)
    ) {
      selectedNetwork = selectDefaultNetwork(networks);

      settings.general.preferredBlockExplorerIds[
        convertGenesisHashToHex(selectedNetwork.genesisHash).toUpperCase()
      ] = selectedNetwork.explorers[0]?.id || null;
      settings.general.selectedNetworkGenesisHash = selectedNetwork.genesisHash;
    }

    return await settingsService.saveAll(settings);
  }
);

export default saveSettingsToStorage;

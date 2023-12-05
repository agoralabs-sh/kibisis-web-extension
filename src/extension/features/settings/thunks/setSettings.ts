import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import {
  SETTINGS_ADVANCED_KEY,
  SETTINGS_APPEARANCE_KEY,
  SETTINGS_GENERAL_KEY,
} from '@extension/constants';

// enums
import { NetworkTypeEnum, SettingsThunkEnum } from '@extension/enums';

// services
import { StorageManager } from '@extension/services';

// types
import {
  IMainRootState,
  INetworkWithTransactionParams,
  ISettings,
} from '@extension/types';

// utils
import {
  convertGenesisHashToHex,
  selectDefaultNetwork,
  selectNetworkFromSettings,
} from '@extension/utils';

const setSettings: AsyncThunk<
  ISettings, // return
  ISettings, // args
  Record<string, never>
> = createAsyncThunk<ISettings, ISettings, { state: IMainRootState }>(
  SettingsThunkEnum.SetSettings,
  async (settings, { getState }) => {
    const storageManager: StorageManager = new StorageManager();
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    let selectedNetwork: INetworkWithTransactionParams | null =
      selectNetworkFromSettings(networks, settings);

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

    await storageManager.setItems({
      [SETTINGS_ADVANCED_KEY]: settings.advanced,
      [SETTINGS_APPEARANCE_KEY]: settings.appearance,
      [SETTINGS_GENERAL_KEY]: settings.general,
    });

    return settings;
  }
);

export default setSettings;

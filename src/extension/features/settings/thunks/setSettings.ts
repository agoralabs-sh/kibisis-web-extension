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
import { IMainRootState, INetwork, ISettings } from '@extension/types';

// utils
import { selectDefaultNetwork } from '@extension/utils';

const setSettings: AsyncThunk<
  ISettings, // return
  ISettings, // args
  Record<string, never>
> = createAsyncThunk<ISettings, ISettings, { state: IMainRootState }>(
  SettingsThunkEnum.SetSettings,
  async (settings, { getState }) => {
    const storageManager: StorageManager = new StorageManager();
    const networks: INetwork[] = getState().networks.items;
    let selectedNetwork: INetwork | null =
      networks.find(
        (value) =>
          value.genesisHash === settings.general.selectedNetworkGenesisHash
      ) || null;

    // if the beta/main-net has been disallowed and the selected network is one of the disallowed, set it to a test one
    if (
      !selectedNetwork ||
      (!settings.advanced.allowBetaNet &&
        selectedNetwork.type === NetworkTypeEnum.Beta) ||
      (!settings.advanced.allowMainNet &&
        selectedNetwork.type === NetworkTypeEnum.Stable)
    ) {
      selectedNetwork = selectDefaultNetwork(networks);

      settings.general.preferredBlockExplorerId =
        selectedNetwork.explorers[0]?.id || null;
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

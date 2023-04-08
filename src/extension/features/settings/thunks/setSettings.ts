import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import {
  SETTINGS_ADVANCED_KEY,
  SETTINGS_APPEARANCE_KEY,
  SETTINGS_NETWORK_KEY,
} from '@extension/constants';

// Enums
import { NetworkTypeEnum, SettingsThunkEnum } from '@extension/enums';

// Services
import { StorageManager } from '@extension/services';

// Types
import { IMainRootState, INetwork, ISettings } from '@extension/types';

// Utils
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

    // if the beta/test net has been disallowed and the selected network is one of the disallowed, set it to a stable one
    if (
      (!settings.advanced.allowBetaNet &&
        settings.network?.type === NetworkTypeEnum.Beta) ||
      (!settings.advanced.allowTestNet &&
        settings.network?.type === NetworkTypeEnum.Test)
    ) {
      settings.network = selectDefaultNetwork(networks);
    }

    await storageManager.setItems({
      [SETTINGS_ADVANCED_KEY]: settings.advanced,
      [SETTINGS_APPEARANCE_KEY]: settings.appearance,
      ...(settings.network && {
        [SETTINGS_NETWORK_KEY]: settings.network,
      }),
    });

    return settings;
  }
);

export default setSettings;

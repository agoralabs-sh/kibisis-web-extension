import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import {
  SETTINGS_ADVANCED_KEY,
  SETTINGS_NETWORK_KEY,
} from '../../../constants';

// Enums
import { NetworkTypeEnum, SettingsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { IMainRootState, INetwork, ISettings } from '../../../types';

// Utils
import { selectDefaultNetwork } from '../../../utils';

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
      ...(settings.network && {
        [SETTINGS_NETWORK_KEY]: settings.network,
      }),
    });

    return settings;
  }
);

export default setSettings;

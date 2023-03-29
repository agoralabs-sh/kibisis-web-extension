import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { SETTINGS_NETWORK_KEY } from '../../../constants';

// Enums
import { SettingsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { IMainRootState, INetwork, ISettings } from '../../../types';

// Utils
import { createDefaultSettings } from '../utils';

const fetchSettings: AsyncThunk<
  ISettings, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<ISettings, undefined, { state: IMainRootState }>(
  SettingsThunkEnum.FetchSettings,
  async (_, { getState }) => {
    const networks: INetwork[] = getState().networks.items;
    const storageManager: StorageManager = new StorageManager();
    const storageItems: Record<string, unknown> =
      await storageManager.getAllItems();

    return Object.keys(storageItems).reduce<ISettings>((acc, value) => {
      switch (value) {
        case SETTINGS_NETWORK_KEY:
          return {
            ...acc,
            network: storageItems[SETTINGS_NETWORK_KEY] as INetwork,
          };
        default:
          return acc;
      }
    }, createDefaultSettings(networks));
  }
);

export default fetchSettings;

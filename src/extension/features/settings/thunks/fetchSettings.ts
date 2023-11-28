import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// constants
import {
  SETTINGS_ADVANCED_KEY,
  SETTINGS_APPEARANCE_KEY,
  SETTINGS_GENERAL_KEY,
} from '@extension/constants';

// enums
import { SettingsThunkEnum } from '@extension/enums';

// services
import { StorageManager } from '@extension/services';

// types
import {
  IAdvancedSettings,
  IAppearanceSettings,
  IGeneralSettings,
  IMainRootState,
  INetwork,
  ISettings,
} from '@extension/types';

// utils
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
        case SETTINGS_ADVANCED_KEY:
          return {
            ...acc,
            advanced: {
              ...acc.advanced,
              ...(storageItems[SETTINGS_ADVANCED_KEY] as IAdvancedSettings),
            },
          };
        case SETTINGS_APPEARANCE_KEY:
          return {
            ...acc,
            appearance: {
              ...acc.appearance,
              ...(storageItems[SETTINGS_APPEARANCE_KEY] as IAppearanceSettings),
            },
          };
        case SETTINGS_GENERAL_KEY:
          return {
            ...acc,
            general: {
              ...acc.general,
              ...(storageItems[SETTINGS_GENERAL_KEY] as IGeneralSettings),
            },
          };
        default:
          return acc;
      }
    }, createDefaultSettings(networks));
  }
);

export default fetchSettings;

import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Constants
import { SETTINGS_NETWORK_KEY } from '../../../constants';

// Enums
import { SettingsThunkEnum } from '../../../enums';

// Services
import { StorageManager } from '../../../services/extension';

// Types
import { IMainRootState, ISettings } from '../../../types';

const setSettings: AsyncThunk<
  ISettings, // return
  ISettings, // args
  Record<string, never>
> = createAsyncThunk<ISettings, ISettings, { state: IMainRootState }>(
  SettingsThunkEnum.SetSettings,
  async (settings) => {
    const storageManager: StorageManager = new StorageManager();

    await storageManager.setItems({
      ...(settings.network && {
        [SETTINGS_NETWORK_KEY]: settings.network,
      }),
    });

    return settings;
  }
);

export default setSettings;

import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import browser from 'webextension-polyfill';

// enums
import { NetworkTypeEnum, SettingsThunkEnum } from '@extension/enums';

// messages
import { InternalPasswordLockDisabledMessage } from '@common/messages';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import { ILogger } from '@common/types';
import {
  IBaseAsyncThunkConfig,
  INetworkWithTransactionParams,
  ISettings,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

const saveSettingsToStorageThunk: AsyncThunk<
  ISettings, // return
  ISettings, // args
  IBaseAsyncThunkConfig
> = createAsyncThunk<ISettings, ISettings, IBaseAsyncThunkConfig>(
  SettingsThunkEnum.SaveSettingsToStorage,
  async (settings, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const networks: INetworkWithTransactionParams[] = getState().networks.items;
    const previousSettings: ISettings = getState().settings;
    const settingsService: SettingsService = new SettingsService({
      logger,
    });
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

    // if the password lock is being disabled, remove the alarm
    if (
      previousSettings.security.enablePasswordLock &&
      !settings.security.enablePasswordLock
    ) {
      await browser.runtime.sendMessage(
        new InternalPasswordLockDisabledMessage()
      );
    }

    return await settingsService.saveAll(settings);
  }
);

export default saveSettingsToStorageThunk;

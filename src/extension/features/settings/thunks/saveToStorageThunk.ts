import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { NetworkTypeEnum } from '@extension/enums';
import { ThunkEnum } from '../enums';

// services
import SettingsService from '@extension/services/SettingsService';

// types
import type {
  IBaseAsyncThunkConfig,
  IMainRootState,
  ISettings,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';
import selectNetworkFromSettings from '@extension/utils/selectNetworkFromSettings';

const saveToStorageThunk: AsyncThunk<
  ISettings, // return
  ISettings, // args
  IBaseAsyncThunkConfig<IMainRootState>
> = createAsyncThunk<
  ISettings,
  ISettings,
  IBaseAsyncThunkConfig<IMainRootState>
>(ThunkEnum.SaveToStorage, async (settings, { getState }) => {
  const logger = getState().system.logger;
  const networks = getState().networks.items;
  const settingsService = new SettingsService({
    logger,
  });
  let network = selectNetworkFromSettings({
    networks,
    settings,
  });
  let encodedGenesisHash: string;

  // if the betanet/testnet has been disallowed and the selected network is one of the disallowed, set it to a main one
  if (
    !network ||
    (!settings.advanced.allowBetaNet &&
      network.type === NetworkTypeEnum.Beta) ||
    (!settings.advanced.allowTestNet && network.type === NetworkTypeEnum.Test)
  ) {
    network = selectDefaultNetwork(networks);
    encodedGenesisHash = convertGenesisHashToHex(network.genesisHash);

    settings.general.preferredBlockExplorerIds[encodedGenesisHash] =
      network.blockExplorers[0]?.id || null;
    settings.general.preferredNFTExplorerIds[encodedGenesisHash] =
      network.nftExplorers[0]?.id || null;
    settings.general.selectedNetworkGenesisHash = network.genesisHash;
  }

  return await settingsService.saveToStorage(settings);
});

export default saveToStorageThunk;

// config
import { networks } from '@extension/config';

// constants
import {
  CREDENTIALS_LOCK_DURATION_NORMAL,
  SETTINGS_ADVANCED_KEY,
  SETTINGS_APPEARANCE_KEY,
  SETTINGS_GENERAL_KEY,
  SETTINGS_PRIVACY_KEY,
  SETTINGS_SECURITY_KEY,
} from '@extension/constants';

// services
import BaseService from '@extension/services/BaseService';

// types
import type {
  IAdvancedSettings,
  IAppearanceSettings,
  IGeneralSettings,
  IPrivacySettings,
  ISecuritySettings,
  ISettings,
} from '@extension/types';

// utils
import selectDefaultNetwork from '@extension/utils/selectDefaultNetwork';

export default class SettingsService extends BaseService {
  /**
   * public static functions
   */

  public static initializeDefaultSettings(): ISettings {
    const { genesisHash } = selectDefaultNetwork(networks);

    return {
      advanced: {
        allowBetaNet: false,
        allowDidTokenFormat: false,
        allowTestNet: false,
        debugLogging: false,
      },
      appearance: {
        font: 'Nunito',
        theme: 'light',
      },
      general: {
        preferredBlockExplorerIds: {},
        preferredNFTExplorerIds: {},
        selectedNetworkGenesisHash: genesisHash,
        selectedNodeIDs: {},
      },
      privacy: {
        allowActionTracking: false,
      },
      security: {
        credentialLockTimeoutDuration: CREDENTIALS_LOCK_DURATION_NORMAL,
        enableCredentialLock: false,
      },
    };
  }

  /**
   * private functions
   */

  /**
   * Sanitizes the settings to only use the relevant properties.
   * @param {ISettings} settings - the settings to sanitize.
   * @returns {ISettings} the sanitized settings.
   * @private
   */
  private _sanitize({
    advanced,
    appearance,
    general,
    privacy,
    security,
  }: ISettings): ISettings {
    return {
      advanced: {
        allowBetaNet: advanced.allowBetaNet,
        allowDidTokenFormat: advanced.allowDidTokenFormat,
        allowTestNet: advanced.allowTestNet,
        debugLogging: advanced.debugLogging,
      },
      appearance: {
        font: appearance.font,
        theme: appearance.theme,
      },
      general: {
        preferredBlockExplorerIds: general.preferredBlockExplorerIds,
        preferredNFTExplorerIds: general.preferredNFTExplorerIds,
        selectedNetworkGenesisHash: general.selectedNetworkGenesisHash,
        selectedNodeIDs: general.selectedNodeIDs,
      },
      privacy: {
        allowActionTracking: privacy.allowActionTracking,
      },
      security: {
        credentialLockTimeoutDuration: security.credentialLockTimeoutDuration,
        enableCredentialLock: security.enableCredentialLock,
      },
    };
  }

  /**
   * public functions
   */

  /**
   * Fetches all the settings from storage.
   * @returns {Promise<ISettings>} the settings.
   */
  public async fetchFromStorage(): Promise<ISettings> {
    const storageItems = await this._storageManager.getAllItems();
    const mergedSettings = Object.keys(storageItems).reduce<ISettings>(
      (acc, value) => {
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
                ...(storageItems[
                  SETTINGS_APPEARANCE_KEY
                ] as IAppearanceSettings),
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
          case SETTINGS_PRIVACY_KEY:
            return {
              ...acc,
              privacy: {
                ...acc.privacy,
                ...(storageItems[SETTINGS_PRIVACY_KEY] as IPrivacySettings),
              },
            };
          case SETTINGS_SECURITY_KEY:
            return {
              ...acc,
              security: {
                ...acc.security,
                ...(storageItems[SETTINGS_SECURITY_KEY] as ISecuritySettings),
              },
            };
          default:
            return acc;
        }
      },
      SettingsService.initializeDefaultSettings()
    );

    return this._sanitize(mergedSettings);
  }

  /**
   * Saves all settings to storage.
   * @param {ISettings} settings - the settings to save.
   * @returns {ISettings} the saved settings.
   */
  public async saveToStorage(settings: ISettings): Promise<ISettings> {
    const _settings = this._sanitize(settings);

    await this._storageManager.setItems({
      [SETTINGS_ADVANCED_KEY]: _settings.advanced,
      [SETTINGS_APPEARANCE_KEY]: _settings.appearance,
      [SETTINGS_GENERAL_KEY]: _settings.general,
      [SETTINGS_PRIVACY_KEY]: _settings.privacy,
      [SETTINGS_SECURITY_KEY]: _settings.security,
    });

    return _settings;
  }
}

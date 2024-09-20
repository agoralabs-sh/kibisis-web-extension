import browser from 'webextension-polyfill';

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

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

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

export default class SettingsRepository extends BaseRepository {
  /**
   * public static functions
   */

  public static initializeDefaultSettings(): ISettings {
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
        selectedNetworkGenesisHash: null,
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
    const { genesisHash } = selectDefaultNetwork(networks);

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
        selectedNetworkGenesisHash:
          general.selectedNetworkGenesisHash || genesisHash,
        selectedNodeIDs: general.selectedNodeIDs,
      },
      privacy: privacy,
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
   * @returns {Promise<ISettings>} A promise that resolves to the settings.
   */
  public async fetch(): Promise<ISettings> {
    const allItems = await browser.storage.local.get();
    const mergedSettings = Object.keys(allItems).reduce<ISettings>(
      (acc, value) => {
        switch (value) {
          case SETTINGS_ADVANCED_KEY:
            return {
              ...acc,
              advanced: {
                ...acc.advanced,
                ...(allItems[SETTINGS_ADVANCED_KEY] as IAdvancedSettings),
              },
            };
          case SETTINGS_APPEARANCE_KEY:
            return {
              ...acc,
              appearance: {
                ...acc.appearance,
                ...(allItems[SETTINGS_APPEARANCE_KEY] as IAppearanceSettings),
              },
            };
          case SETTINGS_GENERAL_KEY:
            return {
              ...acc,
              general: {
                ...acc.general,
                ...(allItems[SETTINGS_GENERAL_KEY] as IGeneralSettings),
              },
            };
          case SETTINGS_PRIVACY_KEY:
            return {
              ...acc,
              privacy: {
                ...acc.privacy,
                ...(allItems[SETTINGS_PRIVACY_KEY] as IPrivacySettings),
              },
            };
          case SETTINGS_SECURITY_KEY:
            return {
              ...acc,
              security: {
                ...acc.security,
                ...(allItems[SETTINGS_SECURITY_KEY] as ISecuritySettings),
              },
            };
          default:
            return acc;
        }
      },
      SettingsRepository.initializeDefaultSettings()
    );

    return this._sanitize(mergedSettings);
  }

  /**
   * Saves settings to storage.
   * @param {ISettings} settings - the settings to save.
   * @returns {Promise<ISettings>} A promise that resolves to the saved settings.
   * @public
   */
  public async save(settings: ISettings): Promise<ISettings> {
    const _settings = this._sanitize(settings);

    await this._save({
      [SETTINGS_ADVANCED_KEY]: _settings.advanced,
      [SETTINGS_APPEARANCE_KEY]: _settings.appearance,
      [SETTINGS_GENERAL_KEY]: _settings.general,
      [SETTINGS_PRIVACY_KEY]: _settings.privacy,
      [SETTINGS_SECURITY_KEY]: _settings.security,
    });

    return _settings;
  }
}

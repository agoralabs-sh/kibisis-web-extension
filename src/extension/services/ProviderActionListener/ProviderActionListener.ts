import { TransactionType } from 'algosdk';
import { v4 as uuid } from 'uuid';
import browser, { Alarms, Tabs, Windows } from 'webextension-polyfill';

// configs
import { networks } from '@extension/config';

// constants
import { CREDENTIAL_LOCK_ALARM } from '@extension/constants';

// enums
import {
  AppTypeEnum,
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
} from '@extension/enums';

// events
import { ARC0300KeyRegistrationTransactionSendEvent } from '@extension/events';

// managers
import AppWindowManager from '@extension/managers/AppWindowManager';

// messages
import { ProviderCredentialLockActivatedMessage } from '@common/messages';

// repositories
import AppWindowRepository from '@extension/repositories/AppWindowRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';
import SystemInfoRepository from '@extension/repositories/SystemInfoRepository';

// services
import CredentialLockService from '../CredentialLockService';
import SettingsService from '../SettingsService';
import StorageManager from '../StorageManager';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import {
  IAppWindow,
  IARC0300BaseSchema,
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
  ISettings,
  TARC0300TransactionSendSchemas,
} from '@extension/types';

// utils
import isExtensionInitialized from '@extension/utils/isExtensionInitialized';
import parseURIToARC0300Schema from '@extension/utils/parseURIToARC0300Schema';
import sendExtensionEvent from '@extension/utils/sendExtensionEvent';
import supportedNetworksFromSettings from '@extension/utils/supportedNetworksFromSettings';

export default class ProviderActionListener {
  // private variables
  private readonly _appWindowManager: AppWindowManager;
  private readonly _appWindowRepository: AppWindowRepository;
  private readonly _credentialLockService: CredentialLockService;
  private _isClearingCredentialLockAlarm: boolean;
  private _isRestartingCredentialLockAlarm: boolean;
  private readonly _logger: ILogger | null;
  private readonly _privateKeyRepository: PrivateKeyRepository;
  private readonly _settingsService: SettingsService;
  private readonly _storageManager: StorageManager;
  private readonly _systemInfoRepository: SystemInfoRepository;

  constructor({ logger }: IBaseOptions) {
    const appWindowRepository = new AppWindowRepository();
    const storageManager: StorageManager = new StorageManager();

    this._appWindowManager = new AppWindowManager({
      appWindowRepository,
      logger,
    });
    this._appWindowRepository = appWindowRepository;
    this._isClearingCredentialLockAlarm = false;
    this._isRestartingCredentialLockAlarm = false;
    this._logger = logger || null;
    this._credentialLockService = new CredentialLockService({
      logger,
    });
    this._privateKeyRepository = new PrivateKeyRepository();
    this._settingsService = new SettingsService({
      logger,
      storageManager,
    });
    this._storageManager = storageManager;
    this._systemInfoRepository = new SystemInfoRepository();
  }

  /**
   * private functions
   */

  private async _clearCredentialLockAlarm(): Promise<void> {
    let alarm = await this._credentialLockService.getAlarm();

    // clear the alarm if the credential lock alarm
    if (!alarm || !this._isClearingCredentialLockAlarm) {
      this._isClearingCredentialLockAlarm = true;

      await this._credentialLockService.clearAlarm();

      this._isClearingCredentialLockAlarm = false;
    }
  }

  private async _getMainWindow(
    includeTabs: boolean = false
  ): Promise<Windows.Window | null> {
    const mainAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.MainApp
    );

    if (mainAppWindows.length <= 0) {
      return null;
    }

    return (
      (await browser.windows.get(mainAppWindows[0].windowId, {
        populate: includeTabs,
      })) || null
    );
  }

  private async _getMainWindowTab(): Promise<Tabs.Tab | null> {
    const mainWindow = await this._getMainWindow(true);

    if (!mainWindow) {
      return null;
    }

    return mainWindow.tabs?.[0] ?? null;
  }

  private async _handleCredentialLockActivated(): Promise<void> {
    const _functionName = '_handleCredentialLockActivated';
    const privateKeyItems = await this._privateKeyRepository.fetchAll();

    // remove all the decrypted private keys
    await this._privateKeyRepository.saveMany(
      privateKeyItems.map((value) => ({
        ...value,
        privateKey: null,
      }))
    );

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: removed decrypted private keys`
    );

    // send a message to the popups to lock the screen
    await browser.runtime.sendMessage(
      new ProviderCredentialLockActivatedMessage()
    );
  }

  private async _restartCredentialLockAlarm(): Promise<void> {
    let alarm = await this._credentialLockService.getAlarm();
    let settings: ISettings = await this._settingsService.fetchFromStorage();

    // restart the alarm if the credential lock is not active, is enabled and the duration is not set to 0 ("never")
    if (
      !this._isRestartingCredentialLockAlarm &&
      !alarm &&
      settings.security.enableCredentialLock &&
      settings.security.credentialLockTimeoutDuration > 0
    ) {
      this._isRestartingCredentialLockAlarm = true;

      await this._credentialLockService.restartAlarm(
        settings.security.credentialLockTimeoutDuration
      );

      this._isRestartingCredentialLockAlarm = false;
    }
  }

  /**
   * public functions
   */

  public async onAlarm(alarm: Alarms.Alarm): Promise<void> {
    const _functionName = 'onAlarm';

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: alarm "${alarm.name}" fired`
    );

    switch (alarm.name) {
      case CREDENTIAL_LOCK_ALARM:
        await this._handleCredentialLockActivated();

        break;
      default:
        break;
    }
  }

  public async onExtensionClick(): Promise<void> {
    const _functionName = 'onExtensionClick';
    const isInitialized = await isExtensionInitialized();
    let mainAppWindows: IAppWindow[];
    let registrationAppWindows: IAppWindow[];

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: browser extension clicked`
    );

    // remove any closed windows
    await this._appWindowManager.hydrate();

    if (!isInitialized) {
      registrationAppWindows = await this._appWindowRepository.fetchByType(
        AppTypeEnum.RegistrationApp
      );

      // if there is a registration app window open, bring it to focus
      if (registrationAppWindows.length > 0) {
        this._logger?.debug(
          `${ProviderActionListener.name}#${_functionName}: no account detected and previous registration app window "${registrationAppWindows[0].windowId}" already open, bringing to focus`
        );

        await browser.windows.update(registrationAppWindows[0].windowId, {
          focused: true,
        });

        return;
      }

      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: no account detected and no main app window open, creating an new one`
      );

      // remove everything from storage
      await this._storageManager.removeAll();

      // if there is no registration app window up, we can open a new one
      await this._appWindowManager.createWindow({
        type: AppTypeEnum.RegistrationApp,
      });

      return;
    }

    mainAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.MainApp
    );

    // if there is a main app window open, bring it to focus
    if (mainAppWindows.length > 0) {
      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: previous account detected and previous main app window "${mainAppWindows[0].windowId}" already open, bringing to focus`
      );

      await browser.windows.update(mainAppWindows[0].windowId, {
        focused: true,
      });

      return;
    }

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: previous account detected and no main app window open, creating an new one`
    );

    // if there is no main app window up, we can open the app and clear the credentials lock alarm
    await this._appWindowManager.createWindow({
      type: AppTypeEnum.MainApp,
    });
    await this._clearCredentialLockAlarm();
  }

  public async onFocusChanged(windowId: number): Promise<void> {
    const _functionName = 'onFocusChanged';
    const mainWindow = await this._getMainWindow();

    if (mainWindow) {
      if (windowId === mainWindow.id) {
        this._logger?.debug(
          `${ProviderActionListener.name}#${_functionName}: main window with id "${windowId}" has focus`
        );

        await this._clearCredentialLockAlarm();

        return;
      }

      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: main window has lost focus to window with id "${windowId}"`
      );

      await this._restartCredentialLockAlarm();
    }
  }

  public async onInstalled(): Promise<void> {
    const _functionName = 'onInstalled';
    let systemInfo = await this._systemInfoRepository.fetch();

    // if there is no system info, initialize the default
    if (!systemInfo) {
      systemInfo = SystemInfoRepository.initializeDefaultSystem();

      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: initialize a new system info with device id "${systemInfo.deviceID}"`
      );

      await this._systemInfoRepository.save(systemInfo);
    }
  }

  public async onOmniboxInputEntered(text: string): Promise<void> {
    const _functionName = 'onOmniboxInputEntered';
    let arc0300Schema: IARC0300BaseSchema | null;

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: received omnibox input "${text}"`
    );

    arc0300Schema = parseURIToARC0300Schema(text, {
      supportedNetworks: supportedNetworksFromSettings({
        networks,
        settings: await this._settingsService.fetchFromStorage(),
      }),
      ...(this._logger && {
        logger: this._logger,
      }),
    });

    if (arc0300Schema) {
      switch (arc0300Schema.authority) {
        case ARC0300AuthorityEnum.Transaction:
          // send
          if (arc0300Schema.paths[0] === ARC0300PathEnum.Send) {
            switch (
              (arc0300Schema as TARC0300TransactionSendSchemas).query.type
            ) {
              case TransactionType.keyreg:
                return await sendExtensionEvent({
                  appWindowRepository: this._appWindowRepository,
                  event: new ARC0300KeyRegistrationTransactionSendEvent({
                    id: uuid(),
                    payload: arc0300Schema as
                      | IARC0300OfflineKeyRegistrationTransactionSendSchema
                      | IARC0300OnlineKeyRegistrationTransactionSendSchema,
                  }),
                  ...(this._logger && {
                    logger: this._logger,
                  }),
                });
              default:
                break;
            }
          }

          break;
        default:
          break;
      }
    }
  }

  public async onWindowRemove(windowId: number): Promise<void> {
    const _functionName = 'onWindowRemove';
    const appWindow = await this._appWindowRepository.fetchById(windowId);

    // remove the app window from storage
    if (appWindow) {
      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: removed "${appWindow.type}" window`
      );

      if (appWindow.type === AppTypeEnum.MainApp) {
        await this._restartCredentialLockAlarm();
      }

      await this._appWindowRepository.removeByIds([windowId]);
    }
  }
}

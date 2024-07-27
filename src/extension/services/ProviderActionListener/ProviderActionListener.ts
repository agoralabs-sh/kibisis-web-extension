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

// messages
import { ProviderCredentialLockActivatedMessage } from '@common/messages';

// services
import AppWindowManagerService from '../AppWindowManagerService';
import CredentialLockService from '../CredentialLockService';
import PrivateKeyService from '../PrivateKeyService';
import SettingsService from '../SettingsService';
import StorageManager from '../StorageManager';
import SystemService from '../SystemService';

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
  private readonly _appWindowManagerService: AppWindowManagerService;
  private readonly _credentialLockService: CredentialLockService;
  private _isClearingCredentialLockAlarm: boolean;
  private _isRestartingCredentialLockAlarm: boolean;
  private readonly _logger: ILogger | null;
  private readonly _privateKeyService: PrivateKeyService;
  private readonly _settingsService: SettingsService;
  private readonly _storageManager: StorageManager;
  private readonly _systemService: SystemService;

  constructor({ logger }: IBaseOptions) {
    const storageManager: StorageManager = new StorageManager();

    this._appWindowManagerService = new AppWindowManagerService({
      logger,
      storageManager,
    });
    this._isClearingCredentialLockAlarm = false;
    this._isRestartingCredentialLockAlarm = false;
    this._logger = logger || null;
    this._credentialLockService = new CredentialLockService({
      logger,
    });
    this._privateKeyService = new PrivateKeyService({
      logger,
      storageManager,
    });
    this._settingsService = new SettingsService({
      logger,
      storageManager,
    });
    this._storageManager = storageManager;
    this._systemService = new SystemService({
      logger,
      storageManager,
    });
  }

  /**
   * private functions
   */

  private async _getMainWindow(
    includeTabs: boolean = false
  ): Promise<Windows.Window | null> {
    const mainAppWindows = await this._appWindowManagerService.getByType(
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
    const privateKeyItems = await this._privateKeyService.fetchAllFromStorage();

    // remove all the decrypted private keys
    await this._privateKeyService.saveManyToStorage(
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
    await this._appWindowManagerService.hydrateAppWindows();

    if (!isInitialized) {
      registrationAppWindows = await this._appWindowManagerService.getByType(
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
      await this._appWindowManagerService.createWindow({
        type: AppTypeEnum.RegistrationApp,
      });

      return;
    }

    mainAppWindows = await this._appWindowManagerService.getByType(
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

    // if there is no main app window up, we can open the app
    await this._appWindowManagerService.createWindow({
      type: AppTypeEnum.MainApp,
    });
  }

  public async onFocusChanged(windowId: number): Promise<void> {
    const _functionName = 'onFocusChanged';
    const mainWindow = await this._getMainWindow();
    let credentialLockAlarm: Alarms.Alarm | null;
    let settings: ISettings;

    if (mainWindow) {
      if (windowId === mainWindow.id) {
        this._logger?.debug(
          `${ProviderActionListener.name}#${_functionName}: main window with id "${windowId}" has focus`
        );

        if (!this._isClearingCredentialLockAlarm) {
          this._isClearingCredentialLockAlarm = true;

          // clear the credential lock alarm
          await this._credentialLockService.clearAlarm();

          this._isClearingCredentialLockAlarm = false;
        }

        return;
      }

      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: main window has lost focus to window with id "${windowId}"`
      );

      credentialLockAlarm = await this._credentialLockService.getAlarm();
      settings = await this._settingsService.getAll();

      // restart the alarm if the credential lock is not active, is enabled and the duration is not set to 0 ("never")
      if (
        !this._isRestartingCredentialLockAlarm &&
        !credentialLockAlarm &&
        settings.security.enableCredentialLock &&
        settings.security.credentialLockTimeoutDuration > 0
      ) {
        this._isRestartingCredentialLockAlarm = true;

        await this._credentialLockService.restartAlarm(
          settings.security.credentialLockTimeoutDuration
        );

        this._isRestartingCredentialLockAlarm = false;

        return;
      }

      return;
    }
  }

  public async onInstalled(): Promise<void> {
    const _functionName = 'onInstalled';
    let systemInfo = await this._systemService.get();

    // if there is no system info, initialize the default
    if (!systemInfo) {
      systemInfo = SystemService.initializeDefaultSystem();

      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: initialize a new system info with device id "${systemInfo.deviceID}"`
      );

      await this._systemService.save(systemInfo);
    }
  }

  public async onOmniboxInputEntered(text: string): Promise<void> {
    const _functionName = 'onOmniboxInputEntered';
    let arc0300Schema: IARC0300BaseSchema | null;
    let settings: ISettings;

    this._logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: received omnibox input "${text}"`
    );

    settings = await this._settingsService.getAll();
    arc0300Schema = parseURIToARC0300Schema(text, {
      supportedNetworks: supportedNetworksFromSettings(networks, settings),
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
                  appWindowManagerService: this._appWindowManagerService,
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
    const appWindow = await this._appWindowManagerService.getById(windowId);

    // remove the app window from storage
    if (appWindow) {
      this._logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: removed "${appWindow.type}" window`
      );

      await this._appWindowManagerService.removeById(windowId);
    }
  }
}

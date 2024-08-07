import { TransactionType } from 'algosdk';
import { v4 as uuid } from 'uuid';
import browser, { Alarms, Tabs, Windows } from 'webextension-polyfill';

// configs
import { networks } from '@extension/config';

// constants
import { PASSWORD_LOCK_ALARM } from '@extension/constants';

// enums
import {
  AppTypeEnum,
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
} from '@extension/enums';

// events
import { ARC0300KeyRegistrationTransactionSendEvent } from '@extension/events';

// messages
import { ProviderPasswordLockTimeoutMessage } from '@common/messages';

// services
import AppWindowManagerService from '../AppWindowManagerService';
import PasswordLockService from '../PasswordLockService';
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
  private readonly appWindowManagerService: AppWindowManagerService;
  private isClearingPasswordLockAlarm: boolean;
  private isRestartingPasswordLockAlarm: boolean;
  private readonly logger: ILogger | null;
  private readonly passwordLockService: PasswordLockService;
  private readonly settingsService: SettingsService;
  private readonly storageManager: StorageManager;
  private readonly systemService: SystemService;

  constructor({ logger }: IBaseOptions) {
    const storageManager: StorageManager = new StorageManager();

    this.appWindowManagerService = new AppWindowManagerService({
      logger,
      storageManager,
    });
    this.isClearingPasswordLockAlarm = false;
    this.isRestartingPasswordLockAlarm = false;
    this.logger = logger || null;
    this.passwordLockService = new PasswordLockService({
      logger,
    });
    this.settingsService = new SettingsService({
      logger,
      storageManager,
    });
    this.storageManager = storageManager;
    this.systemService = new SystemService({
      logger,
      storageManager,
    });
  }

  /**
   * private functions
   */

  private async getMainWindow(
    includeTabs: boolean = false
  ): Promise<Windows.Window | null> {
    const mainAppWindows = await this.appWindowManagerService.getByType(
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

  private async getMainWindowTab(): Promise<Tabs.Tab | null> {
    const mainWindow = await this.getMainWindow(true);

    if (!mainWindow) {
      return null;
    }

    return mainWindow.tabs?.[0] ?? null;
  }

  /**
   * public functions
   */

  public async onAlarm(alarm: Alarms.Alarm): Promise<void> {
    const _functionName = 'onAlarm';

    this.logger?.debug(
      `${ProviderActionListener.name}#${_functionName}(): alarm "${PASSWORD_LOCK_ALARM}" fired`
    );

    switch (alarm.name) {
      case PASSWORD_LOCK_ALARM:
        // send a message to the popups to remove password from store
        await browser.runtime.sendMessage(
          new ProviderPasswordLockTimeoutMessage()
        );

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

    this.logger?.debug(
      `${ProviderActionListener.name}#${_functionName}(): browser extension clicked`
    );

    // remove any closed windows
    await this.appWindowManagerService.hydrateAppWindows();

    if (!isInitialized) {
      registrationAppWindows = await this.appWindowManagerService.getByType(
        AppTypeEnum.RegistrationApp
      );

      // if there is a registration app window open, bring it to focus
      if (registrationAppWindows.length > 0) {
        this.logger?.debug(
          `${ProviderActionListener.name}#${_functionName}(): no account detected and previous registration app window "${registrationAppWindows[0].windowId}" already open, bringing to focus`
        );

        await browser.windows.update(registrationAppWindows[0].windowId, {
          focused: true,
        });

        return;
      }

      this.logger?.debug(
        `${ProviderActionListener.name}#${_functionName}(): no account detected and no main app window open, creating an new one`
      );

      // remove everything from storage
      await this.storageManager.removeAll();

      // if there is no registration app window up, we can open a new one
      await this.appWindowManagerService.createWindow({
        type: AppTypeEnum.RegistrationApp,
      });

      return;
    }

    mainAppWindows = await this.appWindowManagerService.getByType(
      AppTypeEnum.MainApp
    );

    // if there is a main app window open, bring it to focus
    if (mainAppWindows.length > 0) {
      this.logger?.debug(
        `${ProviderActionListener.name}#${_functionName}(): previous account detected and previous main app window "${mainAppWindows[0].windowId}" already open, bringing to focus`
      );

      await browser.windows.update(mainAppWindows[0].windowId, {
        focused: true,
      });

      return;
    }

    this.logger?.debug(
      `${ProviderActionListener.name}#${_functionName}(): previous account detected and no main app window open, creating an new one`
    );

    // if there is no main app window up, we can open the app
    await this.appWindowManagerService.createWindow({
      type: AppTypeEnum.MainApp,
    });
  }

  public async onFocusChanged(windowId: number): Promise<void> {
    const _functionName = 'onFocusChanged';
    const mainWindow = await this.getMainWindow();
    let passwordLockAlarm: Alarms.Alarm | null;
    let settings: ISettings;

    if (mainWindow) {
      if (windowId === mainWindow.id) {
        this.logger?.debug(
          `${ProviderActionListener.name}#${_functionName}: main window with id "${windowId}" has focus`
        );

        if (!this.isClearingPasswordLockAlarm) {
          this.isClearingPasswordLockAlarm = true;

          // clear the password lock alarm
          await this.passwordLockService.clearAlarm();

          this.isClearingPasswordLockAlarm = false;
        }

        return;
      }

      this.logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: main window has lost focus to window with id "${windowId}"`
      );

      passwordLockAlarm = await this.passwordLockService.getAlarm();
      settings = await this.settingsService.getAll();

      // restart the alarm if the password enable lock is on and the duration is not set to 0 ("never")
      if (
        !this.isRestartingPasswordLockAlarm &&
        !passwordLockAlarm &&
        settings.security.enablePasswordLock &&
        settings.security.passwordLockTimeoutDuration > 0
      ) {
        this.isRestartingPasswordLockAlarm = true;

        await this.passwordLockService.restartAlarm(
          settings.security.passwordLockTimeoutDuration
        );

        this.isRestartingPasswordLockAlarm = false;

        return;
      }

      return;
    }
  }

  public async onInstalled(): Promise<void> {
    const _functionName = 'onInstalled';
    let systemInfo = await this.systemService.get();

    // if there is no system info, initialize the default
    if (!systemInfo) {
      systemInfo = SystemService.initializeDefaultSystem();

      this.logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: initialize a new system info with device id "${systemInfo.deviceID}"`
      );

      await this.systemService.save(systemInfo);
    }
  }

  public async onOmniboxInputEntered(text: string): Promise<void> {
    const _functionName = 'onOmniboxInputEntered';
    let arc0300Schema: IARC0300BaseSchema | null;
    let settings: ISettings;

    this.logger?.debug(
      `${ProviderActionListener.name}#${_functionName}: received omnibox input "${text}"`
    );

    settings = await this.settingsService.getAll();
    arc0300Schema = parseURIToARC0300Schema(text, {
      supportedNetworks: supportedNetworksFromSettings(networks, settings),
      ...(this.logger && {
        logger: this.logger,
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
                  appWindowManagerService: this.appWindowManagerService,
                  event: new ARC0300KeyRegistrationTransactionSendEvent({
                    id: uuid(),
                    payload: arc0300Schema as
                      | IARC0300OfflineKeyRegistrationTransactionSendSchema
                      | IARC0300OnlineKeyRegistrationTransactionSendSchema,
                  }),
                  ...(this.logger && {
                    logger: this.logger,
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
    const appWindow = await this.appWindowManagerService.getById(windowId);

    // remove the app window from storage
    if (appWindow) {
      this.logger?.debug(
        `${ProviderActionListener.name}#${_functionName}: removed "${appWindow.type}" window`
      );

      await this.appWindowManagerService.removeById(windowId);
    }
  }
}

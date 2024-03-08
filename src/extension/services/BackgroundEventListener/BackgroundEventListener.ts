import browser, { Alarms, Tabs, Windows } from 'webextension-polyfill';

// constants
import { PASSWORD_LOCK_ALARM } from '@extension/constants';

// enums
import { AppTypeEnum } from '@extension/enums';

// messages
import { InternalPasswordLockTimeoutMessage } from '@common/messages';

// services
import AppWindowManagerService from '../AppWindowManagerService';
import PasswordLockService from '../PasswordLockService';
import PrivateKeyService from '../PrivateKeyService';
import SettingsService from '../SettingsService';
import StorageManager from '../StorageManager';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { IAppWindow, ISettings } from '@extension/types';

export default class BackgroundEventListener {
  // private variables
  private readonly appWindowManagerService: AppWindowManagerService;
  private isClearingPasswordLockAlarm: boolean;
  private isRestartingPasswordLockAlarm: boolean;
  private readonly logger: ILogger | null;
  private readonly passwordLockService: PasswordLockService;
  private readonly privateKeyService: PrivateKeyService;
  private readonly settingsService: SettingsService;
  private readonly storageManager: StorageManager;

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
    this.privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
      storageManager,
    });
    this.settingsService = new SettingsService({
      logger,
      storageManager,
    });
    this.storageManager = storageManager;
  }

  /**
   * private functions
   */

  private async getMainWindow(
    includeTabs: boolean = false
  ): Promise<Windows.Window | null> {
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);

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
    const mainWindow: Windows.Window | null = await this.getMainWindow(true);

    if (!mainWindow) {
      return null;
    }

    return mainWindow.tabs?.[0] ?? null;
  }

  /**
   * public functions
   */

  public async onAlarm(alarm: Alarms.Alarm): Promise<void> {
    const _functionName: string = 'onAlarm';

    this.logger?.debug(
      `${BackgroundEventListener.name}#${_functionName}(): alarm "${PASSWORD_LOCK_ALARM}" fired`
    );

    switch (alarm.name) {
      case PASSWORD_LOCK_ALARM:
        // send a message to the popups to remove password from store
        await browser.runtime.sendMessage(
          new InternalPasswordLockTimeoutMessage()
        );

        break;
      default:
        break;
    }
  }

  public async onExtensionClick(): Promise<void> {
    const _functionName: string = 'onExtensionClick';
    const isInitialized: boolean = await this.privateKeyService.isInitialized();
    let mainAppWindows: IAppWindow[];
    let registrationAppWindows: IAppWindow[];

    this.logger?.debug(
      `${BackgroundEventListener.name}#${_functionName}(): browser extension clicked`
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
          `${BackgroundEventListener.name}#${_functionName}(): no account detected and previous registration app window "${registrationAppWindows[0].windowId}" already open, bringing to focus`
        );

        await browser.windows.update(registrationAppWindows[0].windowId, {
          focused: true,
        });

        return;
      }

      this.logger?.debug(
        `${BackgroundEventListener.name}#${_functionName}(): no account detected and no main app window open, creating an new one`
      );

      // remove everything from storage
      await this.storageManager.removeAll();

      // if there is no registration app window up, we can open a new one
      await this.appWindowManagerService.createWindow({
        type: AppTypeEnum.RegistrationApp,
      });
    }

    mainAppWindows = await this.appWindowManagerService.getByType(
      AppTypeEnum.MainApp
    );

    // if there is a main app window open, bring it to focus
    if (mainAppWindows.length > 0) {
      this.logger?.debug(
        `${BackgroundEventListener.name}#${_functionName}(): previous account detected and previous main app window "${mainAppWindows[0].windowId}" already open, bringing to focus`
      );

      await browser.windows.update(mainAppWindows[0].windowId, {
        focused: true,
      });

      return;
    }

    this.logger?.debug(
      `${BackgroundEventListener.name}#${_functionName}(): previous account detected and no main app window open, creating an new one`
    );

    // if there is no main app window up, we can open the app
    await this.appWindowManagerService.createWindow({
      type: AppTypeEnum.MainApp,
    });
  }

  public async onFocusChanged(windowId: number): Promise<void> {
    const _functionName: string = 'onFocusChanged';
    const mainWindow: Windows.Window | null = await this.getMainWindow();
    let passwordLockAlarm: Alarms.Alarm | null;
    let settings: ISettings;

    if (mainWindow) {
      if (windowId === mainWindow.id) {
        this.logger?.debug(
          `${BackgroundEventListener.name}#${_functionName}: main window with id "${windowId}" has focus`
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
        `${BackgroundEventListener.name}#${_functionName}: main window has lost focus to window with id "${windowId}"`
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

  public async onWindowRemove(windowId: number): Promise<void> {
    const _functionName: string = 'onWindowRemove';
    const appWindow: IAppWindow | null =
      await this.appWindowManagerService.getById(windowId);

    // remove the app window from storage
    if (appWindow) {
      this.logger?.debug(
        `${BackgroundEventListener.name}#${_functionName}(): removed "${appWindow.type}" window`
      );

      await this.appWindowManagerService.removeById(windowId);
    }
  }
}

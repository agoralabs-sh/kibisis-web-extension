import browser, { Alarms, Tabs, Windows } from 'webextension-polyfill';

// constants
import {
  DEFAULT_POPUP_HEIGHT,
  DEFAULT_POPUP_WIDTH,
  PASSWORD_LOCK_ALARM,
} from '@extension/constants';

// enums
import { AppTypeEnum } from '@extension/enums';

// messages
import { InternalPasswordLockUpdatedMessage } from '@common/messages';

// services
import AppWindowManagerService from '../AppWindowManagerService';
import PrivateKeyService from '../PrivateKeyService';
import SettingsService from '../SettingsService';
import StorageManager from '../StorageManager';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { IAppWindow, ISettings } from '@extension/types';

export default class BackgroundEventListener {
  private readonly appWindowManagerService: AppWindowManagerService;
  private readonly logger: ILogger | null;
  private readonly privateKeyService: PrivateKeyService;
  private readonly settingsService: SettingsService;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    const storageManager: StorageManager = new StorageManager();

    this.appWindowManagerService = new AppWindowManagerService({
      logger,
      storageManager,
    });
    this.logger = logger || null;
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

  /**
   * Restarts the password lock alarm with the new
   * @param timeout
   * @private
   */
  private async restartPasswordLockAlarm(timeout: number): Promise<void> {
    // clear the previous alarm and password lock
    await browser.alarms.clear(PASSWORD_LOCK_ALARM);

    // create a new alarm
    browser.alarms.create(PASSWORD_LOCK_ALARM, {
      delayInMinutes: timeout * 60000, // convert the milliseconds to minutes
    });
  }

  /**
   * public functions
   */

  public async onAlarm(alarm: Alarms.Alarm): Promise<void> {
    const _functionName: string = 'onAlarm';

    this.logger?.debug(
      `${BackgroundEventListener.name}#${_functionName}(): alarm "${alarm.name}" fired`
    );

    switch (alarm.name) {
      case PASSWORD_LOCK_ALARM:
        // send a message to the popups to remove password from store
        await browser.runtime.sendMessage(
          new InternalPasswordLockUpdatedMessage(null)
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
    let mainWindow: Windows.Window;
    let registrationAppWindows: IAppWindow[];
    let registrationWindow: Windows.Window;

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
      registrationWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'registration-app.html',
        width: DEFAULT_POPUP_WIDTH,
      });

      // save the registration window to storage
      return await this.appWindowManagerService.saveByBrowserWindowAndType(
        registrationWindow,
        AppTypeEnum.RegistrationApp
      );
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
    mainWindow = await browser.windows.create({
      height: DEFAULT_POPUP_HEIGHT,
      type: 'popup',
      url: 'main-app.html',
      width: DEFAULT_POPUP_WIDTH,
    });

    // save the main app window to storage
    await this.appWindowManagerService.saveByBrowserWindowAndType(
      mainWindow,
      AppTypeEnum.MainApp
    );
  }

  public async onTabUpdated(tabId: number): Promise<void> {
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);
    let mainWindow: Windows.Window | null;
    let mainWindowTab: Tabs.Tab | null;
    let settings: ISettings;

    // check if the updated tab is the main app window
    if (mainAppWindows.length > 0) {
      mainWindow =
        (await browser.windows.get(mainAppWindows[0].windowId, {
          populate: true,
        })) || null;

      if (mainWindow) {
        mainWindowTab = mainWindow.tabs ? mainWindow.tabs[0] : null;

        if (mainWindowTab && mainWindowTab.id === tabId) {
          settings = await this.settingsService.getAll();

          // restart the alarm based on the password lock timeout, if the password lock is enabled
          if (settings.security.enablePasswordLock) {
            await this.restartPasswordLockAlarm(
              settings.security.passwordLockTimeoutDuration
            );
          }
        }
      }
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

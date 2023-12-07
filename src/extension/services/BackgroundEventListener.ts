import browser, { Windows } from 'webextension-polyfill';

// constants
import {
  DEFAULT_POPUP_HEIGHT,
  DEFAULT_POPUP_WIDTH,
} from '@extension/constants';

// enums
import { AppTypeEnum } from '@extension/enums';

// services
import AppWindowManagerService from './AppWindowManagerService';
import PrivateKeyService from './PrivateKeyService';
import StorageManager from './StorageManager';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { IAppWindow } from '@extension/types';

export default class BackgroundEventListener {
  private readonly appWindowManagerService: AppWindowManagerService;
  private readonly logger: ILogger | null;
  private readonly privateKeyService: PrivateKeyService;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.appWindowManagerService = new AppWindowManagerService({
      logger,
    });
    this.logger = logger || null;
    this.privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
    this.storageManager = new StorageManager();
  }

  /**
   * public functions
   */

  public async onExtensionClick(): Promise<void> {
    const _functionName: string = 'onExtensionClick';
    const isInitialized: boolean = await this.privateKeyService.isInitialized();
    let mainAppWindows: IAppWindow[];
    let mainWindow: Windows.Window;
    let registrationWindow: Windows.Window;

    // remove any closed windows
    await this.appWindowManagerService.hydrateAppWindows();

    if (!isInitialized) {
      this.logger &&
        this.logger.debug(
          `${BackgroundEventListener.name}#${_functionName}(): no account detected, registering new account`
        );

      // remove everything from storage
      await this.storageManager.removeAll();

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

    // if there is no main app window up, we can open the app
    if (mainAppWindows.length <= 0) {
      this.logger &&
        this.logger.debug(
          `${BackgroundEventListener.name}#${_functionName}(): previous account detected, opening main app`
        );

      mainWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'main-app.html',
        width: DEFAULT_POPUP_WIDTH,
      });

      // save the main app window to storage
      return await this.appWindowManagerService.saveByBrowserWindowAndType(
        mainWindow,
        AppTypeEnum.MainApp
      );
    }
  }

  public async onWindowRemove(windowId: number): Promise<void> {
    const _functionName: string = 'onWindowRemove';
    const appWindow: IAppWindow | null =
      await this.appWindowManagerService.getById(windowId);

    // remove the app window from storage
    if (appWindow) {
      this.logger &&
        this.logger.debug(
          `${BackgroundEventListener.name}#${_functionName}(): removed "${appWindow.type}" window`
        );

      await this.appWindowManagerService.removeById(windowId);
    }
  }
}

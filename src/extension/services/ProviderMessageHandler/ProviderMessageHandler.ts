import browser from 'webextension-polyfill';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';
import { AppTypeEnum } from '@extension/enums';

// messages
import { BaseProviderMessage } from '@common/messages';

// services
import AppWindowManagerService from '../AppWindowManagerService';
import PasswordLockService from '../PasswordLockService';
import StorageManager from '../StorageManager';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { IAppWindow } from '@extension/types';

export default class ProviderMessageHandler {
  // private variables
  private readonly appWindowManagerService: AppWindowManagerService;
  private readonly logger: ILogger | null;
  private readonly passwordLockService: PasswordLockService;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    const storageManager: StorageManager = new StorageManager();

    this.appWindowManagerService = new AppWindowManagerService({
      logger,
      storageManager,
    });
    this.logger = logger || null;
    this.passwordLockService = new PasswordLockService({
      logger,
    });
    this.storageManager = storageManager;
  }

  /**
   * private functions
   */

  private async handleFactoryResetMessage(): Promise<void> {
    const backgroundAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.BackgroundApp);
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);

    // remove the main app if it exists
    if (mainAppWindows.length > 0) {
      await Promise.all(
        mainAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
    }

    // remove the background apps if they exist
    if (backgroundAppWindows.length > 0) {
      await Promise.all(
        backgroundAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
    }

    // remove everything from storage
    await this.storageManager.removeAll();
  }

  private async handlePasswordLockClearMessage(): Promise<void> {
    const _functionName: string = 'handlePasswordLockClearMessage';

    await this.passwordLockService.clearAlarm();

    this.logger?.debug(
      `${ProviderMessageHandler.name}#${_functionName}: password lock cleared`
    );
  }

  private async handleRegistrationCompletedMessage(): Promise<void> {
    const mainAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.MainApp);
    const registrationAppWindows: IAppWindow[] =
      await this.appWindowManagerService.getByType(AppTypeEnum.RegistrationApp);

    // if there is no main app windows, create a new one
    if (mainAppWindows.length <= 0) {
      await this.appWindowManagerService.createWindow({
        type: AppTypeEnum.MainApp,
        ...(registrationAppWindows[0] && {
          left: registrationAppWindows[0].left,
          top: registrationAppWindows[0].top,
        }),
      });
    }

    // if registration app windows exist remove them
    if (registrationAppWindows.length > 0) {
      await Promise.all(
        registrationAppWindows.map(
          async (value) => await browser.windows.remove(value.windowId)
        )
      );
    }
  }

  /**
   * public functions
   */

  public async onMessage(message: BaseProviderMessage): Promise<void> {
    const _functionName: string = 'onMessage';

    this.logger?.debug(
      `${ProviderMessageHandler.name}#${_functionName}: message "${message.reference}" received`
    );

    switch (message.reference) {
      case ProviderMessageReferenceEnum.FactoryReset:
        return await this.handleFactoryResetMessage();
      case ProviderMessageReferenceEnum.PasswordLockClear:
        return this.handlePasswordLockClearMessage();
      case ProviderMessageReferenceEnum.RegistrationCompleted:
        return await this.handleRegistrationCompletedMessage();
      default:
        break;
    }
  }
}

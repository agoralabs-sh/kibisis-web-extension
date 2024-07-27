import browser from 'webextension-polyfill';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';
import { AppTypeEnum } from '@extension/enums';

// messages
import { BaseProviderMessage } from '@common/messages';

// services
import AppWindowManagerService from '../AppWindowManagerService';
import StorageManager from '../StorageManager';

// types
import type { IBaseOptions, ILogger } from '@common/types';
import type { IAppWindow } from '@extension/types';

export default class ProviderMessageHandler {
  // private variables
  private readonly _appWindowManagerService: AppWindowManagerService;
  private readonly _logger: ILogger | null;
  private readonly _storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    const storageManager: StorageManager = new StorageManager();

    this._appWindowManagerService = new AppWindowManagerService({
      logger,
      storageManager,
    });
    this._logger = logger || null;
    this._storageManager = storageManager;
  }

  /**
   * private functions
   */

  private async _handleFactoryResetMessage(): Promise<void> {
    const backgroundAppWindows: IAppWindow[] =
      await this._appWindowManagerService.getByType(AppTypeEnum.BackgroundApp);
    const mainAppWindows: IAppWindow[] =
      await this._appWindowManagerService.getByType(AppTypeEnum.MainApp);

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
    await this._storageManager.removeAll();
  }

  private async _handleRegistrationCompletedMessage(): Promise<void> {
    const mainAppWindows: IAppWindow[] =
      await this._appWindowManagerService.getByType(AppTypeEnum.MainApp);
    const registrationAppWindows: IAppWindow[] =
      await this._appWindowManagerService.getByType(
        AppTypeEnum.RegistrationApp
      );

    // if there is no main app windows, create a new one
    if (mainAppWindows.length <= 0) {
      await this._appWindowManagerService.createWindow({
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
    const _functionName = 'onMessage';

    this._logger?.debug(
      `${ProviderMessageHandler.name}#${_functionName}: message "${message.reference}" received`
    );

    switch (message.reference) {
      case ProviderMessageReferenceEnum.FactoryReset:
        return await this._handleFactoryResetMessage();
      case ProviderMessageReferenceEnum.RegistrationCompleted:
        return await this._handleRegistrationCompletedMessage();
      default:
        break;
    }
  }
}

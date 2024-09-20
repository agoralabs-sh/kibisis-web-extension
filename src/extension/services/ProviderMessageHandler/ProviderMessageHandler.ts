import browser from 'webextension-polyfill';

// enums
import { ProviderMessageReferenceEnum } from '@common/enums';
import { AppTypeEnum } from '@extension/enums';

// managers
import AppWindowManager from '@extension/managers/AppWindowManager';

// messages
import { BaseProviderMessage } from '@common/messages';

// repositories
import AppWindowRepository from '@extension/repositories/AppWindowRepository';

// types
import type { IBaseOptions, ILogger } from '@common/types';

export default class ProviderMessageHandler {
  // private variables
  private readonly _appWindowRepository: AppWindowRepository;
  private readonly _logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this._appWindowRepository = new AppWindowRepository();
    this._logger = logger || null;
  }

  /**
   * private functions
   */

  private async _handleFactoryResetMessage(): Promise<void> {
    const backgroundAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.BackgroundApp
    );
    const mainAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.MainApp
    );

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
    await browser.storage.local.clear();
  }

  private async _handleRegistrationCompletedMessage(): Promise<void> {
    const mainAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.MainApp
    );
    const registrationAppWindows = await this._appWindowRepository.fetchByType(
      AppTypeEnum.RegistrationApp
    );

    // if there is no main app windows, create a new one
    if (mainAppWindows.length <= 0) {
      await new AppWindowManager({
        appWindowRepository: this._appWindowRepository,
        ...(this._logger && {
          logger: this._logger,
        }),
      }).createWindow({
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

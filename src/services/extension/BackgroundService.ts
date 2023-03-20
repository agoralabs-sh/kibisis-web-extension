import { IEnableResult } from '@agoralabs-sh/algorand-provider';
import browser, { Windows } from 'webextension-polyfill';

// Constants
import { DEFAULT_POPUP_HEIGHT, DEFAULT_POPUP_WIDTH } from '../../constants';

// Events
import { EnableRequestEvent } from '../../events';

// Services
import PrivateKeyService from './PrivateKeyService';

// Types
import { IBaseOptions, ILogger } from '../../types';

export default class BackgroundService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly privateKeyService: PrivateKeyService;
  private registrationWindow: Windows.Window | null;
  private mainWindow: Windows.Window | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.mainWindow = null;
    this.registrationWindow = null;
    this.privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
  }

  /**
   * Public functions
   */

  public async onEnableRequest(
    event: EnableRequestEvent,
    host: string,
    callback: (result: IEnableResult) => void
  ): Promise<void> {
    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#onEnableRequest(): "${host}" has requested to connect`
      );
  }

  public async onExtensionClick(): Promise<void> {
    const isInitialized: boolean = await this.privateKeyService.isInitialized();

    if (!isInitialized) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onExtensionClick(): no account detected, registering new account`
        );

      this.registrationWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'register.html',
        width: DEFAULT_POPUP_WIDTH,
      });

      return;
    }

    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#onExtensionClick(): previous account detected, opening main app`
      );

    this.mainWindow = await browser.windows.create({
      height: DEFAULT_POPUP_HEIGHT,
      type: 'popup',
      url: 'main.html',
      width: DEFAULT_POPUP_WIDTH,
    });

    return;
  }

  public async onRegistrationComplete(): Promise<void> {
    // if there is no main window, create a new one
    if (!this.mainWindow) {
      this.mainWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'main.html',
        width: DEFAULT_POPUP_WIDTH,
        ...(this.registrationWindow && {
          left: this.registrationWindow.left,
          top: this.registrationWindow.top,
        }),
      });
    }

    // if the register window exists remove it
    if (this.registrationWindow && this.registrationWindow.id) {
      await browser.windows.remove(this.registrationWindow.id);
    }
  }

  public onWindowRemove(windowId: number): void {
    if (this.mainWindow && this.mainWindow.id === windowId) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onWindowRemove(): removed main app window`
        );

      this.mainWindow = null;
    }

    if (this.registrationWindow && this.registrationWindow.id === windowId) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onWindowRemove(): removed registration app window`
        );

      this.registrationWindow = null;
    }
  }
}

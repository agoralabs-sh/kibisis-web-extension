import browser, { Windows } from 'webextension-polyfill';

// Constants
import { DEFAULT_POPUP_HEIGHT, DEFAULT_POPUP_WIDTH } from '../constants';

// Services
import PrivateKeyService from './PrivateKeyService';

// Types
import { IBaseOptions, ILogger } from '../types';

export default class BackgroundService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly privateKeyService: PrivateKeyService;
  private registrationPopupWindow: Windows.Window | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.registrationPopupWindow = null;
    this.privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
  }

  /**
   * Public functions
   */

  public async onExtensionClick(): Promise<void> {
    const isInitialized: boolean = await this.privateKeyService.isInitialized();

    if (!isInitialized && !this.registrationPopupWindow) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onExtensionClick(): on-boarding new user`
        );

      this.registrationPopupWindow = await browser.windows.create({
        height: DEFAULT_POPUP_HEIGHT,
        type: 'popup',
        url: 'register.html',
        width: DEFAULT_POPUP_WIDTH,
      });
    }
  }

  public async onRegistrationComplete(): Promise<void> {
    if (this.registrationPopupWindow && this.registrationPopupWindow.id) {
      await browser.windows.remove(this.registrationPopupWindow.id);
    }
  }

  public onWindowRemove(windowId: number): void {
    if (
      this.registrationPopupWindow &&
      this.registrationPopupWindow.id === windowId
    ) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onWindowRemove(): removed registration popup window`
        );

      this.registrationPopupWindow = null;
    }
  }
}

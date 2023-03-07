import browser, { Tabs, Windows } from 'webextension-polyfill';

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
  private popupWindow: Windows.Window | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.popupWindow = null;
    this.privateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
  }

  /**
   * Private functions
   */

  private async createOrUpdateWindow(url: string): Promise<void> {
    let tab: Tabs.Tab | null = null;

    if (this.popupWindow && this.popupWindow.id) {
      if (this.popupWindow.tabs) {
        tab = this.popupWindow.tabs.find((value) => value.url === url) || null;
      }

      // if the tab is already present, ignore
      if (tab) {
        return;
      }

      // if there is no tab, create one
      await browser.tabs.create({
        url,
        windowId: this.popupWindow.id,
      });

      return;
    }

    // if we don't have the popup window open, create a new one
    this.popupWindow = await browser.windows.create({
      height: DEFAULT_POPUP_HEIGHT,
      type: 'popup',
      url,
      width: DEFAULT_POPUP_WIDTH,
    });

    return;
  }

  /**
   * Public functions
   */

  public async onExtensionClick(): Promise<void> {
    const isInitialized: boolean = await this.privateKeyService.isInitialized();

    if (!isInitialized) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onExtensionClick(): no account detected, registering new account`
        );

      return this.createOrUpdateWindow('register.html');
    }

    this.logger &&
      this.logger.debug(
        `${BackgroundService.name}#onExtensionClick(): previous account detected`
      );

    return this.createOrUpdateWindow('main.html');
  }

  public async onRegistrationComplete(): Promise<void> {
    let registerTab: Tabs.Tab | null;
    let mainTab: Tabs.Tab | null;

    if (this.popupWindow && this.popupWindow.id && this.popupWindow.tabs) {
      registerTab =
        this.popupWindow.tabs.find((value) => value.url === 'register.html') ||
        null;
      mainTab =
        this.popupWindow.tabs.find((value) => value.url === 'main.html') ||
        null;

      // if there is no main tab, create a new tab
      if (!mainTab) {
        await browser.tabs.create({
          url: 'main.html',
          windowId: this.popupWindow.id,
        });
      }

      // if the register tab exists remove it
      if (registerTab && registerTab.id) {
        await browser.tabs.remove(registerTab.id);
      }
    }
  }

  public onWindowRemove(windowId: number): void {
    if (this.popupWindow && this.popupWindow.id === windowId) {
      this.logger &&
        this.logger.debug(
          `${BackgroundService.name}#onWindowRemove(): removed popup window`
        );

      this.popupWindow = null;
    }
  }
}

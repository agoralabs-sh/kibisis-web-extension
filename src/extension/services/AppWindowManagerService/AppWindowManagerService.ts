import browser, { Windows } from 'webextension-polyfill';

// constants
import { APP_WINDOW_KEY_PREFIX } from '@extension/constants';

// enums
import { AppTypeEnum } from '@extension/enums';

// services
import StorageManager from '../StorageManager';

// types
import type { ILogger } from '@common/types';
import type { IAppWindow } from '@extension/types';
import type { ICreateOptions } from './types';

/**
 * Manages app windows in storage.
 * @class
 */
export default class AppWindowManagerService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor({ logger, storageManager }: ICreateOptions) {
    this.logger = logger || null;
    this.storageManager = storageManager || new StorageManager();
  }

  /**
   * private functions
   */

  /**
   * Convenience function that simply creates the app window item key from the window ID.
   * @param {number} id - the window ID.
   * @returns {string} the app window item key.
   */
  private createAppWindowItemKey(id: number): string {
    return `${APP_WINDOW_KEY_PREFIX}${id}`;
  }

  /**
   * public functions
   */

  public async getAll(): Promise<IAppWindow[]> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();

    return Object.keys(items).reduce<IAppWindow[]>(
      (acc, key) =>
        key.startsWith(APP_WINDOW_KEY_PREFIX)
          ? [...acc, items[key] as IAppWindow]
          : acc,
      []
    );
  }

  public async getById(id: number): Promise<IAppWindow | null> {
    return await this.storageManager.getItem<IAppWindow>(
      this.createAppWindowItemKey(id)
    );
  }

  public async getByType(type: AppTypeEnum): Promise<IAppWindow[]> {
    const appWindows: IAppWindow[] = await this.getAll();

    return appWindows.filter((value) => value.type === type);
  }

  /**
   * Checks if the app windows in storage are still open. If the windows are no longer open, they are removed.
   */
  public async hydrateAppWindows(): Promise<void> {
    const openWindows: Windows.Window[] = await browser.windows.getAll();
    const appWindows: IAppWindow[] = await this.getAll();
    const stagnantWindowKeys: string[] = [];

    appWindows.forEach((appWindow) => {
      const openWindow: Windows.Window | null =
        openWindows.find((value) => value.id === appWindow.windowId) || null;

      // if no window is open, remove it
      if (!openWindow) {
        stagnantWindowKeys.push(
          this.createAppWindowItemKey(appWindow.windowId)
        );
      }
    });

    await this.storageManager.remove(stagnantWindowKeys);
  }

  public async removeById(id: number): Promise<void> {
    return await this.storageManager.remove(this.createAppWindowItemKey(id));
  }

  public async removeByType(type: AppTypeEnum): Promise<void> {
    const appWindows: IAppWindow[] = await this.getByType(type);

    return await this.storageManager.remove(
      appWindows.map((value) => this.createAppWindowItemKey(value.windowId))
    );
  }

  public async saveByBrowserWindowAndType(
    window: Windows.Window,
    type: AppTypeEnum
  ): Promise<void> {
    if (!window.id) {
      return;
    }

    return await this.storageManager.setItems({
      [this.createAppWindowItemKey(window.id)]: {
        left: window.left || 0,
        top: window.top || 0,
        type,
        windowId: window.id,
      },
    });
  }
}

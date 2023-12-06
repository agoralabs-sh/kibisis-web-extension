import { Windows } from 'webextension-polyfill';

// constants
import { APP_WINDOW_KEY_PREFIX } from '@extension/constants';

// enums
import { AppTypeEnum } from '@extension/enums';

// services
import StorageManager from './StorageManager';

// types
import { IBaseOptions, ILogger } from '@common/types';
import { IAppWindow } from '@extension/types';

/**
 * Manages app windows in storage.
 * @class
 */
export default class AppWindowManagerService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.storageManager = new StorageManager();
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

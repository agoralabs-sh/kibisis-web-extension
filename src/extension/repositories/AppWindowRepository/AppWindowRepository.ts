// constants
import { APP_WINDOW_KEY_PREFIX } from '@extension/constants';

// enums
import { AppTypeEnum } from '@extension/enums';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IAppWindow } from '@extension/types';
import type { ISaveOptions } from './types';

/**
 * Manages app windows in storage.
 * @class
 */
export default class AppWindowRepository extends BaseRepository {
  /**
   * private functions
   */

  /**
   * Convenience function that simply creates the app window item key from the window ID.
   * @param {number} id - the window ID.
   * @returns {string} the app window item key.
   */
  private _createAppWindowItemKey(id: number): string {
    return `${APP_WINDOW_KEY_PREFIX}${id}`;
  }

  /**
   * public functions
   */

  public async fetchAll(): Promise<IAppWindow[]> {
    return await this._fetchByPrefixKey<IAppWindow>(APP_WINDOW_KEY_PREFIX);
  }

  public async fetchById(id: number): Promise<IAppWindow | null> {
    return await this._fetchByKey<IAppWindow>(this._createAppWindowItemKey(id));
  }

  public async fetchByType(type: AppTypeEnum): Promise<IAppWindow[]> {
    const items = await this._fetchByPrefixKey<IAppWindow>(
      APP_WINDOW_KEY_PREFIX
    );

    return items.filter((value) => value.type === type);
  }

  public async removeByIds(ids: number[]): Promise<void> {
    return await this._removeByKeys(
      ids.map((value) => this._createAppWindowItemKey(value))
    );
  }

  public async removeByType(type: AppTypeEnum): Promise<void> {
    const items = await this.fetchByType(type);

    return await this._removeByKeys(
      items.map((value) => this._createAppWindowItemKey(value.windowId))
    );
  }

  public async save({ id, item }: ISaveOptions): Promise<IAppWindow> {
    await this._save({
      [this._createAppWindowItemKey(id)]: item,
    });

    return item;
  }
}

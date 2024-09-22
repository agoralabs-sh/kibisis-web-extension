import { v4 as uuid } from 'uuid';

// constants
import { SYSTEM_KEY } from '@extension/constants';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { ISystemInfo } from '@extension/types';

export default class SystemInfoRepository extends BaseRepository {
  /**
   * public static functions
   */

  public static initializeDefaultSystem(): ISystemInfo {
    return {
      deviceID: uuid(),
      polisAccountID: null,
      whatsNewInfo: {
        disableOnUpdate: false,
        version: null,
      },
    };
  }

  /**
   * private functions
   */

  private _sanitize(item: ISystemInfo): ISystemInfo {
    return {
      deviceID: item.deviceID || null,
      polisAccountID: item.polisAccountID || null,
      whatsNewInfo: item.whatsNewInfo,
    };
  }

  /**
   * public functions
   */

  /**
   * Fetches the system info from storage.
   * @returns {Promise<ISession[]>} A promise that resolves to system info or null.
   * @public
   */
  public async fetch(): Promise<ISystemInfo | null> {
    const item = await this._fetchByKey<ISystemInfo>(SYSTEM_KEY);

    return item ? this._sanitize(item) : null;
  }

  /**
   * Save the system info to storage.
   * @param {ISystemInfo} item - the system info to save.
   * @returns {Promise<ISystemInfo>} A promise that resolves to the saved system info.
   * @public
   */
  public async save(item: ISystemInfo): Promise<ISystemInfo> {
    const _item = this._sanitize(item);

    await this._save({
      [SYSTEM_KEY]: _item,
    });

    return _item;
  }
}

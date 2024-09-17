import { v4 as uuid } from 'uuid';

// constants
import { SYSTEM_KEY } from '@extension/constants';

// services
import BaseService from '@extension/services/BaseService';

// types
import type { ISystemInfo } from '@extension/types';
import type { ICreateOptions } from './types';

export default class SystemService extends BaseService {
  /**
   * public static functions
   */

  public static initializeDefaultSystem(): ISystemInfo {
    return {
      deviceID: uuid(),
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
      whatsNewInfo: item.whatsNewInfo,
    };
  }

  /**
   * public functions
   */

  /**
   * Get the system information if it exists.
   * @returns {Promise<ISystemInfo | null>} a promise that resolves to the system information or null.
   */
  public async fetchFromStorage(): Promise<ISystemInfo | null> {
    const item = await this._storageManager.getItem<ISystemInfo>(SYSTEM_KEY);

    return item ? this._sanitize(item) : null;
  }

  /**
   * Saves the system information. This will update any existing system information.
   * @param {ISystemInfo} item - the system information.
   * @returns {Promise<ISystemInfo>} a promise that resolves to the system information.
   */
  public async saveToStorage(item: ISystemInfo): Promise<ISystemInfo> {
    const _item = this._sanitize(item);

    await this._storageManager.setItems({
      [SYSTEM_KEY]: _item,
    });

    return _item;
  }
}

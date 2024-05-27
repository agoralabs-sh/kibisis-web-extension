import { v4 as uuid } from 'uuid';

// constants
import { SYSTEM_KEY } from '@extension/constants';

// services
import StorageManager from '../StorageManager';

// types
import type { ISystemInfo } from '@extension/types';
import type { ICreateOptions } from './types';

export default class SystemService {
  // private variables
  private readonly storageManager: StorageManager;

  constructor(options?: ICreateOptions) {
    this.storageManager = options?.storageManager || new StorageManager();
  }

  /**
   * public static functions
   */

  public static initializeDefaultSystem(): ISystemInfo {
    return {
      deviceID: uuid(),
    };
  }

  /**
   * public functions
   */

  /**
   * Get the system information if it exists.
   * @returns {Promise<ISystemInfo | null>} a promise that resolves to the system information or null.
   */
  public async get(): Promise<ISystemInfo | null> {
    return (await this.storageManager.getItem(SYSTEM_KEY)) || null;
  }

  /**
   * Saves the system information. This will update any existing system information.
   * @param {ISystemInfo} system - the system information.
   * @returns {Promise<ISystemInfo>} a promise that resolves to the system information.
   */
  public async save(system: ISystemInfo): Promise<ISystemInfo> {
    await this.storageManager.setItems({
      [SYSTEM_KEY]: system,
    });

    return system;
  }
}

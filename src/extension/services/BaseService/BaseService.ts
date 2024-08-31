import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';

// services
import StorageManager from '@extension/services/StorageManager';

// types
import type { INewOptions } from './types';

export default class BaseService {
  // protected variables
  protected readonly _storageManager: StorageManager;

  constructor(options?: INewOptions) {
    this._storageManager = options?.storageManager || new StorageManager();
  }

  /**
   * Convenience that decodes a public/private key from hexadecimal.
   * @param {string} encodedKey - the hexadecimal encoded key to decode.
   * @returns {Uint8Array} the decoded key.
   * @public
   * @static
   */
  public static decode(encodedKey: string): Uint8Array {
    return decodeHex(encodedKey);
  }

  /**
   * Convenience that encodes a public/private key to uppercase hexadecimal.
   * @param {Uint8Array} key - the key to encode.
   * @returns {string} the key encoded to uppercase hexadecimal.
   * @public
   * @static
   */
  public static encode(key: Uint8Array): string {
    return encodeHex(key);
  }
}

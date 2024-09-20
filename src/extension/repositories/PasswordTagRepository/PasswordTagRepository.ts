import { v4 as uuid } from 'uuid';

// constants
import { PASSWORD_TAG_ITEM_KEY } from '@extension/constants';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IPasswordTag } from '@extension/types';
import type { ICreateOptions } from './types';

export default class PasswordTagRepository extends BaseRepository {
  // public static variables
  public static readonly version: number = 0;

  /**
   * public static functions
   */

  /**
   * Convenience function that creates a password tag item.
   * @param {ICreateOptions} options - the raw encrypted tag.
   * @returns {IPasswordTag} an initialized password tag item.
   * @public
   * @static
   */
  public static create({ encryptedTag }: ICreateOptions): IPasswordTag {
    return {
      encryptedTag: PasswordTagRepository.encode(encryptedTag),
      id: uuid(),
      version: PasswordTagRepository.version,
    };
  }

  /**
   * public functions
   */

  /**
   * Fetches the password tag from storage.
   * @returns {Promise<IPasswordTag | null>} A promise that resolves to the password tag or null if no password tag in
   * storage.
   * @public
   */
  public async fetch(): Promise<IPasswordTag | null> {
    return await this._fetchByKey<IPasswordTag>(PASSWORD_TAG_ITEM_KEY);
  }

  /**
   * Removes the stored password tag from storage.
   * @public
   */
  public async remove(): Promise<void> {
    return await this._removeByKeys(PASSWORD_TAG_ITEM_KEY);
  }

  /**
   * Saves the password tag to storage. This will overwrite the current password tag.
   * @param {IPasswordTag} item - The password tag to save.
   * @returns {Promise<IPasswordTag>} A promise that resolves to the saved password tag.
   * @public
   */
  public async save(item: IPasswordTag): Promise<IPasswordTag> {
    await this._save<IPasswordTag>({
      [PASSWORD_TAG_ITEM_KEY]: item,
    });

    return item;
  }
}

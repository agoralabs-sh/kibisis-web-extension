// constants
import { SESSION_ITEM_KEY_PREFIX } from '@extension/constants';

// repositories
import BaseRepositoryService from '@extension/repositories/BaseRepositoryService';

// types
import type { ISession } from '@extension/types';

export default class SessionRepositoryService extends BaseRepositoryService {
  /**
   * private functions
   */

  /**
   * Convenience function that simply creates an item key from the session ID.
   * @param {string} id - the session ID.
   * @returns {string} the session item key.
   * @private
   */
  private _createItemKey(id: string): string {
    return `${SESSION_ITEM_KEY_PREFIX}${id}`;
  }

  /**
   * public functions
   */

  /**
   * Fetches all the sessions from storage.
   * @returns {Promise<ISession[]>} A promise that resolves to all the sessions in storage.
   * @public
   */
  public async fetchAll(): Promise<ISession[]> {
    return await this._fetchByPrefixKey<ISession>(SESSION_ITEM_KEY_PREFIX);
  }

  /**
   * Fetches the session for a given ID from storage.
   * @param {string} id - the session ID.
   * @returns {Promise<ISession | null>} A promise that resolves to the session or null.
   * @public
   */
  public async fetchById(id: string): Promise<ISession | null> {
    return await this._fetchByKey(this._createItemKey(id));
  }

  /**
   * Removes the sessions from storage.
   * @public
   */
  public async removeAll(): Promise<void> {
    await this._removeByKeyPrefix(SESSION_ITEM_KEY_PREFIX);
  }

  /**
   * Removes the sessions by the IDs.
   * @param {string[]} ids - the session IDs to remove.
   * @public
   */
  public async removeByIds(ids: string[]): Promise<void> {
    await this._removeByKeys(ids.map((value) => this._createItemKey(value)));
  }

  /**
   * Save a session to storage
   * @param {ISession} session - the session to save.
   * @returns {Promise<ISession>} A promise that resolves to the saved session.
   * @public
   */
  public async save(session: ISession): Promise<ISession> {
    await this._save({
      [this._createItemKey(session.id)]: session,
    });

    return session;
  }
}

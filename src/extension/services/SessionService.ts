// Constants
import { SESSION_ITEM_KEY_PREFIX } from '@extension/constants';

// Services
import StorageManager from './StorageManager';

// Types
import { IBaseOptions, ILogger } from '@common/types';
import { ISession } from '@extension/types';

export default class SessionService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
    this.storageManager = new StorageManager();
  }

  /**
   * Private functions
   */

  /**
   * Convenience function that simply creates an item key from the session ID.
   * @param {string} id - the session ID.
   * @returns {string} the session item key.
   */
  private createItemKey(id: string): string {
    return `${SESSION_ITEM_KEY_PREFIX}${id}`;
  }

  /**
   * Public functions
   */

  /**
   * Gets all the sessions.
   * @returns {Promise<ISession[]>} all the sessions.
   */
  public async getAll(): Promise<ISession[]> {
    const items: Record<string, unknown> =
      await this.storageManager.getAllItems();

    return Object.keys(items).reduce<ISession[]>(
      (acc, key) =>
        key.startsWith(SESSION_ITEM_KEY_PREFIX)
          ? [...acc, items[key] as ISession]
          : acc,
      []
    );
  }

  /**
   * Gets the session for a given ID.
   * @param {string} id - the session ID.
   * @returns {Promise<ISession | null>} the session or null.
   */
  public async getById(id: string): Promise<ISession | null> {
    return await this.storageManager.getItem(this.createItemKey(id));
  }

  /**
   * Removes a session by its ID.
   * @param {string} id - the session ID.
   */
  public async removeById(id: string): Promise<void> {
    await this.storageManager.remove(this.createItemKey(id));
  }

  public async save(session: ISession): Promise<ISession> {
    await this.storageManager.setItems({
      [this.createItemKey(session.id)]: session,
    });

    return session;
  }
}

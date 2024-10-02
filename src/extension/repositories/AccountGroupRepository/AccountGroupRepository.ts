import { v4 as uuid } from 'uuid';

// constants
import { ACCOUNT_GROUPS_ITEM_KEY } from '@extension/constants';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IAccountGroup } from '@extension/types';

// utils
import upsertItemsById from '@extension/utils/upsertItemsById';

export default class AccountGroupRepository extends BaseRepository {
  /**
   * public static functions
   */

  public static initializeDefaultAccountGroup(name: string): IAccountGroup {
    return {
      createdAt: new Date().getTime(),
      id: uuid(),
      name,
    };
  }

  /**
   * public functions
   */

  /**
   * Fetches the account groups from storage.
   * @returns {Promise<IAccountGroup[]>} A promise that resolves to the account groups.
   * @public
   */
  public async fetchAll(): Promise<IAccountGroup[]> {
    const items = await this._fetchByKey<IAccountGroup[]>(
      ACCOUNT_GROUPS_ITEM_KEY
    );

    if (!items) {
      return [];
    }

    return items;
  }

  /**
   * Saves the account group to storage.
   * @param {IAccountGroup} value - The account group to upsert.
   * @returns {Promise<IAccountGroup>} A promise that resolves to the account group.
   * @public
   */
  public async save(value: IAccountGroup): Promise<IAccountGroup> {
    let items = await this.fetchAll();

    items = upsertItemsById(items, [value]);

    await this._save<IAccountGroup[]>({
      [ACCOUNT_GROUPS_ITEM_KEY]: items,
    });

    return value;
  }
}

// constants
import { ACTIVE_ACCOUNT_DETAILS_KEY } from '@extension/constants';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IActiveAccountDetails } from '@extension/types';

export default class ActiveAccountRepository extends BaseRepository {
  /**
   * public functions
   */

  /**
   * Fetches the active account details from storage.
   * @returns {Promise<IActiveAccountDetails | null>} the active account details or null if none exist.
   */
  public async fetch(): Promise<IActiveAccountDetails | null> {
    return await this._fetchByKey<IActiveAccountDetails>(
      ACTIVE_ACCOUNT_DETAILS_KEY
    );
  }

  /**
   * Saves the active account details to storage,
   * @param {IActiveAccountDetails} value - The active account details.
   * @returns {Promise<IActiveAccountDetails>} The saved active account details.
   */
  public async save(
    value: IActiveAccountDetails
  ): Promise<IActiveAccountDetails> {
    await this._save<IActiveAccountDetails>({
      [ACTIVE_ACCOUNT_DETAILS_KEY]: value,
    });

    return value;
  }
}

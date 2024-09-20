// constants
import { PASSKEY_CREDENTIAL_KEY } from '@extension/constants';

// repositories
import BaseRepository from '@extension/repositories/BaseRepository';

// types
import type { IPasskeyCredential } from '@extension/types';

export default class PasskeyCredentialRepository extends BaseRepository {
  /**
   * public functions
   */

  /**
   * Fetches the passkey credential from storage.
   * @returns {Promise<IPasskeyCredential | null>} A promise that resolves to the passkey credential or null if no
   * passkey credential exists in storage.
   * @public
   */
  public async fetch(): Promise<IPasskeyCredential | null> {
    return await this._fetchByKey<IPasskeyCredential>(PASSKEY_CREDENTIAL_KEY);
  }

  /**
   * Removes the stored passkey credential.
   * @public
   */
  public async remove(): Promise<void> {
    return await this._removeByKeys(PASSKEY_CREDENTIAL_KEY);
  }

  /**
   * Saves the credential to storage.
   * NOTE: This will overwrite the current stored credential.
   * @param {IPasskeyCredential} item - The credential to save.
   * @returns {Promise<IPasskeyCredential>} A promise that resolves to the saved credential.
   * @public
   */
  public async save(item: IPasskeyCredential): Promise<IPasskeyCredential> {
    await this._save<IPasskeyCredential>({
      [PASSKEY_CREDENTIAL_KEY]: item,
    });

    return item;
  }
}

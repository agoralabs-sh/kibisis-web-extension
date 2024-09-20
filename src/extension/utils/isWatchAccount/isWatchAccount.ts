// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IAccount } from '@extension/types';

/**
 * Determines if a given account ID is a watch account or not.
 * @param {IAccount} account - The account.
 * @returns true if the account is a watch account, false otherwise.
 */
export default async function isWatchAccount(
  account: IAccount
): Promise<boolean> {
  // if there is no private key stored, it is a watch account
  return !(await new PrivateKeyRepository().fetchByPublicKey(
    account.publicKey
  ));
}

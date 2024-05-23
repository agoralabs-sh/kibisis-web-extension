// services
import AccountService from '@extension/services/AccountService';

// types
import type { IOptions } from './types';

/**
 * Convenience function that checks if an account's re-keyed auth account is present in a list of accounts, and is NOT a
 * watch account (an account without a private key).
 * @param {IOptions} options - a list of accounts and the auth address to check.
 * @returns {boolean} true if the re-keyed auth account is present and is not a watch account, false otherwise.
 */
export default function isReKeyedAuthAccountAvailable({
  accounts,
  authAddress,
}: IOptions): boolean {
  const reKeyedAccount = accounts.find(
    (value) =>
      AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
      authAddress
  );

  // if the account exists and is not a watch account (it has a private key present)
  return !!reKeyedAccount && !reKeyedAccount.watchAccount;
}

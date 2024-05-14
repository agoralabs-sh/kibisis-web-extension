import browser from 'webextension-polyfill';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IOptions } from './types';

/**
 * Determines if a given account ID is a watch account or not.
 * @param {IOptions} options - options that specify the account.
 * @returns true if the account is a watch account, false otherwise.
 */
export default async function isWatchAccount({
  account,
  logger,
}: IOptions): Promise<boolean> {
  const privateKeyService = new PrivateKeyService({
    logger,
    passwordTag: browser.runtime.id,
  });

  // if there is no private key stored, it is a watch account
  return !(await privateKeyService.getPrivateKeyByPublicKey(account.publicKey));
}

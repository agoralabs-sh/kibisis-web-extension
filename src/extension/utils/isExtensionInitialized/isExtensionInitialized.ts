import browser from 'webextension-polyfill';

// services
import PasswordService from '@extension/services/PasswordService';

/**
 * Determines if the extension has been initialized. An extension is considered initialized if the password tag exists
 * in storage.
 * @returns {Promise<boolean>} a promise that resolves to true if the extension is initialized, false otherwise.
 */
export default async function isExtensionInitialized(): Promise<boolean> {
  const passwordService = new PasswordService({
    passwordTag: browser.runtime.id,
  });
  const passwordTagItem = await passwordService.fetchFromStorage();

  return !!passwordTagItem;
}

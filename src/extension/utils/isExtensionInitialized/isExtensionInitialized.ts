// services
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';

/**
 * Determines if the extension has been initialized. An extension is considered initialized if the password tag exists
 * in storage.
 * @returns {Promise<boolean>} a promise that resolves to true if the extension is initialized, false otherwise.
 */
export default async function isExtensionInitialized(): Promise<boolean> {
  const passwordTagItem = await new PasswordTagRepository().fetch();

  return !!passwordTagItem;
}

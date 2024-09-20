// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

/**
 * Convenience function that checks if the private keys are unencrypted. If all the keys are unencrypted, the lock is
 * considered "inactive". If one or all of the keys are not unencrypted, the lock is considered "active".
 * @returns {Promise<boolean>} A promise that resolves to true if any or all the keys are not unencrypted. Otherwise,
 * it resolves to false.
 */
export default async function isCredentialLockActive(): Promise<boolean> {
  const privateKeyItems = await new PrivateKeyRepository().fetchAll();

  return privateKeyItems.some(
    ({ privateKey }) => typeof privateKey !== 'string'
  );
}

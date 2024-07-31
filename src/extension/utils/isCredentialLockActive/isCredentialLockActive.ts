// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IBaseOptions } from '@common/types';

/**
 * Convenience function that checks if the private keys are unencrypted. If all the keys are unencrypted, the lock is
 * considered "inactive". If one or all of the keys are not unencrypted, the lock is considered "active"
 * @param {IBaseOptions} options - base options, including the logger.
 * @returns {Promise<boolean>} a promise that resolves to true if any or all the keys are not unencrypted. Otherwise,
 * it resolves to false.
 */
export default async function isCredentialLockActive({
  logger,
}: IBaseOptions): Promise<boolean> {
  const privateKeyService = new PrivateKeyService({
    logger,
  });
  const privateKeyItems = await privateKeyService.fetchAllFromStorage();

  return privateKeyItems.some(
    ({ privateKey }) => typeof privateKey !== 'string'
  );
}

// errors
import { MalformedDataError } from '@extension/errors';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPrivateKey } from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function that fetches the unencrypted private key from storage and converts it to a key pair.
 * @param {IOptions} options - the public key.
 * @returns {Promise<Ed21559KeyPair | null>} a promise that resolves to the key pair or null if there was no private key
 * associated with the public key in storage.
 * @throws {MalformedDataError} if no unencrypted private key exists.
 */
export default async function fetchDecryptedKeyPairFromStorageWithUnencrypted({
  logger,
  privateKeyService,
  publicKey,
}: IOptions): Promise<Ed21559KeyPair | null> {
  const _functionName = 'fetchDecryptedKeyPairFromStorageWithUnencrypted';
  const _privateKeyService =
    privateKeyService ||
    new PrivateKeyService({
      logger,
    });
  let _error: string;
  let _publicKey: string;
  let privateKeyItem: IPrivateKey | null;

  _publicKey =
    typeof publicKey !== 'string'
      ? PrivateKeyService.encode(publicKey)
      : publicKey; // encode the public key if it isn't already
  privateKeyItem = await _privateKeyService.fetchFromStorageByPublicKey(
    _publicKey
  );

  if (!privateKeyItem) {
    logger?.debug(
      `${_functionName}: no private key stored for public key "${_publicKey}"`
    );

    return null;
  }

  if (!privateKeyItem.privateKey) {
    _error = `no unencrypted private key found in storage`;

    logger?.error(`${_functionName}: ${_error}`);

    throw new MalformedDataError(_error);
  }

  return Ed21559KeyPair.generateFromPrivateKey(
    PrivateKeyService.decode(privateKeyItem.privateKey)
  );
}

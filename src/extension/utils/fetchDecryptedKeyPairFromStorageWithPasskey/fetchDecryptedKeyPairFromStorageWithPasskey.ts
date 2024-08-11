// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { MalformedDataError } from '@extension/errors';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// services
import PasskeyService from '@extension/services/PasskeyService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPasskeyCredential, IPrivateKey } from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function that fetches the private key from storage and converts it to a key pair using the passkey.
 * @param {IOptions} options - the passkey input key material and the public key.
 * @returns {Promise<Ed21559KeyPair | null>} a promise that resolves to the key pair or null if there was no private key
 * associated with the public key in storage.
 * @throws {MalformedDataError} if no passkey exists.
 * @throws {DecryptionError} if the private key failed to be decrypted with the supplied passkey.
 */
export default async function fetchDecryptedKeyPairFromStorageWithPasskey({
  inputKeyMaterial,
  logger,
  passkeyService,
  privateKeyService,
  publicKey,
}: IOptions): Promise<Ed21559KeyPair | null> {
  const _functionName = 'fetchDecryptedKeyPairFromStorageWithPasskey';
  const _passkeyService =
    passkeyService ||
    new PasskeyService({
      logger,
    });
  const _privateKeyService =
    privateKeyService ||
    new PrivateKeyService({
      logger,
    });
  let _error: string;
  let _publicKey: string;
  let decryptedPrivateKey: Uint8Array;
  let passkey: IPasskeyCredential | null;
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

  passkey = await _passkeyService.fetchFromStorage();

  if (!passkey) {
    _error = `no passkey found in storage`;

    logger?.error(`${_functionName}: ${_error}`);

    throw new MalformedDataError(_error);
  }

  privateKeyItem = await PrivateKeyService.upgrade({
    encryptionCredentials: {
      inputKeyMaterial,
      passkey,
      type: EncryptionMethodEnum.Passkey,
    },
    logger,
    privateKeyItem,
  });

  logger?.debug(
    `${_functionName}: decrypting private key for public key "${_publicKey}"`
  );

  decryptedPrivateKey = await PasskeyService.decryptBytes({
    encryptedBytes: PrivateKeyService.decode(
      privateKeyItem.encryptedPrivateKey
    ),
    inputKeyMaterial,
    logger,
    passkey,
  });

  return Ed21559KeyPair.generateFromPrivateKey(decryptedPrivateKey);
}

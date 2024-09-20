// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { MalformedDataError } from '@extension/errors';

// managers
import PasskeyManager from '@extension/managers/PasskeyManager';

// repositories
import PasskeyCredentialRepository from '@extension/repositories/PasskeyCredentialRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IPrivateKey } from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function that encrypts a private key with the passkey and saves it to storage.
 * @param {IOptions} options - the input key material used to derive the encryption key and the key pair.
 * @returns {Promise<Uint8Array | null>} a promise that resolves to the saved private key item or null if the private
 * key failed to save.
 * @throws {MalformedDataError} if no passkey exists.
 * @throws {EncryptionError} if the private key failed to be encrypted with the supplied input key material.
 */
export default async function savePrivateKeyItemWithPasskey({
  inputKeyMaterial,
  keyPair,
  logger,
  passkeyCredentialRepository,
  privateKeyRepository,
  saveUnencryptedPrivateKey = false,
}: IOptions): Promise<IPrivateKey | null> {
  const _functionName = 'savePrivateKeyItemWithPasskey';
  const _passkeyCredentialRepository =
    passkeyCredentialRepository || new PasskeyCredentialRepository();
  const _privateKeyRepository =
    privateKeyRepository || new PrivateKeyRepository();
  const passkey = await _passkeyCredentialRepository.fetch();
  let _error: string;
  let encryptedPrivateKey: Uint8Array;
  let privateKeyItem: IPrivateKey | null;

  if (!passkey) {
    _error = `no passkey found in storage`;

    logger?.error(`${_functionName}: ${_error}`);

    throw new MalformedDataError(_error);
  }

  privateKeyItem = await _privateKeyRepository.fetchByPublicKey(
    keyPair.publicKey
  );

  if (!privateKeyItem) {
    logger?.debug(
      `${_functionName}: key for "${PrivateKeyRepository.encode(
        keyPair.publicKey
      )}" (public key) doesn't exist, creating a new one`
    );

    // encrypt the private key and add it to storage
    encryptedPrivateKey = await PasskeyManager.encryptBytes({
      bytes: keyPair.privateKey,
      inputKeyMaterial,
      logger,
      passkey,
    });
    privateKeyItem = await _privateKeyRepository.save(
      PrivateKeyRepository.create({
        encryptedPrivateKey,
        encryptionID: passkey.id,
        encryptionMethod: EncryptionMethodEnum.Passkey,
        publicKey: keyPair.publicKey,
        ...(saveUnencryptedPrivateKey && {
          privateKey: keyPair.privateKey,
        }),
      })
    );
  }

  return privateKeyItem;
}

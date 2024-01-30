import { encode as encodeUtf8 } from '@stablelib/utf8';
import scrypt from 'scrypt-async';
import { hash, secretbox } from 'tweetnacl';

/**
 * Creates a hashed key derivation using for a secret using a salt.
 * @param {string} secret - the secret to create the derivation key from.
 * @param {Uint8Array} salt - a salt to use with the secret.
 * @returns {Uint8Array} the derivation key's raw bytes.
 */
export default function createDerivedKeyFromSecret(
  secret: string,
  salt: Uint8Array
): Promise<Uint8Array> {
  return new Promise<Uint8Array>((resolve) => {
    const hashedSecret: Uint8Array = hash(encodeUtf8(secret));

    scrypt(
      hashedSecret,
      salt,
      {
        N: 16384, // cpu/memory cost parameter (must be power of two; alternatively, you can specify logN where N = 2^logN).
        r: 8, // block size parameter
        p: 1, // parallelization parameter
        dkLen: secretbox.keyLength, // derived key length
        encoding: 'binary',
      },
      (derivedKey: Uint8Array) => resolve(derivedKey)
    );
  });
}

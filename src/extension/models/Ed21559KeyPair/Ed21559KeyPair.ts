import { sign, type SignKeyPair } from 'tweetnacl';

// types
import type { INewOptions } from './types';

export default class Ed21559KeyPair {
  // public variables
  public readonly privateKey: Uint8Array;
  public readonly publicKey: Uint8Array;

  constructor({ privateKey, publicKey }: INewOptions) {
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  /**
   * public static functions
   */

  /**
   * Generates a new Ed21559 key pair.
   * @returns {Ed21559KeyPair} a new Ed21559 key pair.
   * @public
   * @static
   */
  public static generate(): Ed21559KeyPair {
    const keyPair: SignKeyPair = sign.keyPair();

    return new Ed21559KeyPair({
      privateKey: keyPair.secretKey.slice(0, sign.seedLength), // the private key or "seed" is the first 32 bytes of the "secret key" which is the private key concentrated to the public key
      publicKey: keyPair.publicKey,
    });
  }

  /**
   * Generates an Ed21559 key pair from a private key.
   * @param {Uint8Array} privateKey - a 32-byte private key (seed).
   * @returns {Ed21559KeyPair} a new Ed21559 key pair.
   * @public
   * @static
   */
  public static generateFromPrivateKey(privateKey: Uint8Array): Ed21559KeyPair {
    const keyPair: SignKeyPair = sign.keyPair.fromSeed(privateKey);

    return new Ed21559KeyPair({
      privateKey: keyPair.secretKey.slice(0, sign.seedLength), // the private key or "seed" is the first 32 bytes of the "secret key" which is the private key concentrated to the public key
      publicKey: keyPair.publicKey,
    });
  }

  /**
   * public functions
   */

  /**
   * Gets the secret key for signing. The secret key is a 64 byte concatenation of the private key (32 byte) and the
   * public key (32 byte).
   * @returns {Uint8Array} the secret key used for signing.
   * @public
   */
  public getSecretKey(): Uint8Array {
    const secretKey = new Uint8Array(
      this.privateKey.length + this.publicKey.length
    );

    secretKey.set(this.privateKey);
    secretKey.set(this.publicKey, this.privateKey.length);

    return secretKey;
  }
}

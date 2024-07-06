import { encode as encodeHex, decode as decodeHex } from '@stablelib/hex';
import { randomBytes } from 'tweetnacl';

// constants
import { PASSKEY_CREDENTIAL_KEY } from '@extension/constants';

// errors
import {
  PasskeyCreationError,
  PasskeyNotSupportedError,
  UnableToFetchPasskeyError,
} from '@extension/errors';

// services
import StorageManager from '@extension/services/StorageManager';

// types
import type {
  IAuthenticationExtensionsClientOutputs,
  ILogger,
} from '@common/types';
import type { IPasskeyCredential } from '@extension/types';
import type {
  ICreatePasskeyCredentialOptions,
  IFetchPasskeyKeyMaterialOptions,
  INewOptions,
} from './types';

export default class PasskeyService {
  // private variables
  private readonly logger: ILogger | null;
  private readonly storageManager: StorageManager;

  constructor(options?: INewOptions) {
    this.logger = options?.logger || null;
    this.storageManager = options?.storageManager || new StorageManager();
  }

  /**
   * public static functions
   */

  /**
   * Registers a passkey with the authenticator and returns the credentials that are used to fetch the key material to derive an
   * encryption key. NOTE: this requires PRF extension support and will throw an error if the authenticator does not
   * support it.
   * @param {ICreatePasskeyOptions} options - the device ID and an optional logger.
   * @returns {Promise<IPasskeyCredential>} a promise that resolves to a created passkey credential.
   * @throws {PasskeyCreationError} if the public key credentials failed to be created on the authenticator.
   * @throws {PasskeyNotSupportedError} if the browser does not support WebAuthn or the authenticator does not support
   * the PRF extension.
   * @public
   * @static
   */
  public static async createPasskeyCredential({
    deviceID,
    logger,
  }: ICreatePasskeyCredentialOptions): Promise<IPasskeyCredential> {
    const _functionName = 'createPasskey';
    const salt = randomBytes(32);
    let _error: string;
    let credential: PublicKeyCredential | null;
    let extensionResults: IAuthenticationExtensionsClientOutputs;

    try {
      credential = (await navigator.credentials.create({
        publicKey: {
          authenticatorSelection: {
            userVerification: 'discouraged',
          },
          challenge: randomBytes(32),
          extensions: {
            // @ts-ignore
            prf: {
              eval: {
                first: salt,
              },
            },
          },
          pubKeyCredParams: [
            { alg: -8, type: 'public-key' }, // Ed25519
            { alg: -7, type: 'public-key' }, // ES256
            { alg: -257, type: 'public-key' }, // RS256
          ],
          rp: {
            name: 'Kibisis Web Extension',
          },
          user: {
            id: new TextEncoder().encode(deviceID),
            name: deviceID,
            displayName: 'Kibisis Passkey',
          },
        },
      })) as PublicKeyCredential | null;
    } catch (error) {
      logger?.error(`${PasskeyService.name}#${_functionName}:`, error);

      throw new PasskeyCreationError(error.message);
    }

    if (!credential) {
      _error = 'failed to create a passkey';

      logger?.error(`${PasskeyService.name}#${_functionName}: ${_error}`);

      throw new PasskeyCreationError(_error);
    }

    extensionResults = credential.getClientExtensionResults();

    // if the prf is not present or the not enabled, the browser does not support the prf extension
    if (!extensionResults.prf?.enabled) {
      _error = 'authenticator does not support the prf extension for webauthn';

      logger?.error(`${PasskeyService.name}#${_functionName}: ${_error}`);

      throw new PasskeyNotSupportedError(_error);
    }

    return {
      id: encodeHex(new Uint8Array(credential.rawId)),
      salt: encodeHex(salt),
      transports: (
        credential.response as AuthenticatorAttestationResponse
      ).getTransports() as AuthenticatorTransport[],
    };
  }

  /**
   * Fetches the key material from the authenticator that is used to derive the encryption key.
   * @param {IFetchPasskeyKeyMaterialOptions} options - passkey credentials and a logger.
   * @returns {Promise<Uint8Array>} a promise that resolves to the key material used to derive an encryption key.
   * @throws {UnableToFetchPasskeyError} if the authenticator did not return the public key credentials.
   * @throws {PasskeyNotSupportedError} if the browser does not support WebAuthn or the authenticator does not support
   * the PRF extension.
   * @public
   * @static
   */
  public static async fetchKeyMaterialFromPasskey({
    credential,
    logger,
  }: IFetchPasskeyKeyMaterialOptions): Promise<Uint8Array> {
    const _functionName = 'fetchPasskey';
    let _error: string;
    let _credential: PublicKeyCredential | null;
    let extensionResults: IAuthenticationExtensionsClientOutputs;

    try {
      _credential = (await navigator.credentials.get({
        publicKey: {
          allowCredentials: [
            {
              id: decodeHex(credential.id),
              transports: credential.transports,
              type: 'public-key',
            },
          ],
          challenge: randomBytes(32),
          extensions: {
            // @ts-ignore
            prf: {
              eval: {
                first: decodeHex(credential.salt),
              },
            },
          },
          userVerification: 'discouraged',
        },
      })) as PublicKeyCredential | null;
    } catch (error) {
      logger?.error(`${PasskeyService.name}#${_functionName}:`, error);

      throw new UnableToFetchPasskeyError(credential.id, error.message);
    }

    if (!_credential) {
      _error = `failed to fetch passkey "${credential.id}"`;

      logger?.error(`${PasskeyService.name}#${_functionName}: ${_error}`);

      throw new UnableToFetchPasskeyError(credential.id, _error);
    }

    extensionResults = _credential.getClientExtensionResults();

    // if the prf is not present or not results, the browser does not support the prf extension
    if (!extensionResults.prf?.results) {
      _error = 'authenticator does not support the prf extension for webauthn';

      logger?.error(`${PasskeyService.name}#${_functionName}: ${_error}`);

      throw new PasskeyNotSupportedError(_error);
    }

    return new Uint8Array(extensionResults.prf.results.first);
  }

  /**
   * Convenience function that simply checks if the browser supports public key WebAuthn.
   * @returns {boolean} true of the browser supports public key WebAuthn, false otherwise.
   * @public
   * @static
   */
  public static isSupported(): boolean {
    return !!window?.PublicKeyCredential;
  }

  /**
   * public functions
   */

  /**
   * Fetches the passkey credential from storage.
   * @returns {Promise<IPasskeyCredential | null>} a promise that resolves to the passkey credential or null if no
   * passkey credential exists in storage.
   * @public
   */
  public async fetchFromStorage(): Promise<IPasskeyCredential | null> {
    return await this.storageManager.getItem<IPasskeyCredential>(
      PASSKEY_CREDENTIAL_KEY
    );
  }

  /**
   * Removes the stored passkey credential.
   * @public
   */
  public async removeFromStorage(): Promise<void> {
    return await this.storageManager.remove(PASSKEY_CREDENTIAL_KEY);
  }

  /**
   * Saves the credential to storage. This will overwrite the current stored credential.
   * @param {IPasskeyCredential} credential - the credential to save.
   * @returns {Promise<IPasskeyCredential>} a promise that resolves to the saved credential.
   * @public
   */
  public async saveToStorage(
    credential: IPasskeyCredential
  ): Promise<IPasskeyCredential> {
    await this.storageManager.setItems({
      [PASSKEY_CREDENTIAL_KEY]: credential,
    });

    return credential;
  }
}

import { encode as encodeHex } from '@stablelib/hex';
import { randomBytes } from 'tweetnacl';

// errors
import { PasskeyNotSupportedError } from '@extension/errors';

// types
import type {
  IAuthenticationExtensionsClientOutputs,
  IBaseOptions,
  ILogger,
} from '@common/types';
import type { ICreatePasskeyOptions, ICreatePasskeyResult } from './types';

export default class PasskeyService {
  // private variables
  private logger: ILogger | null;

  constructor({ logger }: IBaseOptions) {
    this.logger = logger || null;
  }

  /**
   * public static functions
   */

  /**
   *
   * @param {ICreatePasskeyOptions} options - the device ID and an optional logger.
   * @returns {Promise<ICreatePasskeyResult | null>}
   * @throws {PasskeyNotSupportedError} if the browser does not support WebAuthn or the authenticator does not support
   * the PRF extension.
   * @public
   * @static
   */
  public static async createPasskey({
    deviceID,
    logger,
  }: ICreatePasskeyOptions): Promise<ICreatePasskeyResult> {
    const _functionName = 'createPasskey';
    const salt = randomBytes(32);
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: randomBytes(32),
        rp: {
          name: 'Kibisis Web Extension',
        },
        user: {
          id: new TextEncoder().encode(deviceID),
          name: deviceID,
          displayName: 'Kibisis Passkey',
        },
        pubKeyCredParams: [
          { alg: -8, type: 'public-key' }, // Ed25519
          { alg: -7, type: 'public-key' }, // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          userVerification: 'required',
        },
        extensions: {
          // @ts-ignore
          prf: {
            eval: {
              first: salt,
            },
          },
        },
      },
    });
    let _error: string;
    let extensionResults: IAuthenticationExtensionsClientOutputs;

    if (!credential) {
      _error = 'browser does not support webauthn';

      logger?.error(`${PasskeyService.name}#${_functionName}: ${_error}`);

      throw new PasskeyNotSupportedError(_error);
    }

    extensionResults = (
      credential as PublicKeyCredential
    ).getClientExtensionResults();

    // if the prf is not present or the not enabled, the browser does not support the prf extension
    if (!extensionResults.prf?.enabled) {
      _error = 'authenticator does not support the prf extension for webauthn';

      logger?.error(`${PasskeyService.name}#${_functionName}: ${_error}`);

      throw new PasskeyNotSupportedError(_error);
    }

    return {
      credential,
      salt: encodeHex(salt),
    };
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
}

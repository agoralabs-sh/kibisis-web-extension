import { decodeURLSafe as decodeBase64Url } from '@stablelib/base64';

// Types
import {
  IDecodedJwt,
  IDecodedJwtHeader,
  IDecodedJwtPayload,
} from '@extension/types';

/**
 * Decodes a JWT header and payload into a JSON.
 * @param {string} input - the bae64 url encoded JWT header and payload concatenated with a "."
 * @returns {IDecodedJwt | null} a decoded JWT, or null if the JWT is invalid or doesn't conform to RFC-7519.
 * @see {@link https://www.rfc-editor.org/rfc/rfc7519}
 */
export default function decodeJwt(input: string): IDecodedJwt | null {
  const [encodedHeader, encodedPayload] = input.split('.');
  let decodedHeader: Record<string, string>;
  let decodedPayload: Record<string, string | number>;
  let decoder: TextDecoder;
  let header: IDecodedJwtHeader;
  let payload: IDecodedJwtPayload;
  let rawHeader: Uint8Array;
  let rawPayload: Uint8Array;

  if (!encodedHeader || !encodedPayload) {
    return null;
  }

  try {
    decoder = new TextDecoder();
    rawHeader = decodeBase64Url(encodedHeader);
    decodedHeader = JSON.parse(decoder.decode(rawHeader));

    header = {
      algorithm: decodedHeader['alg'],
      curve: decodedHeader['crv'],
      type: decodedHeader['typ'],
    };

    if (!header.type || header.type !== 'JWT' || !header.algorithm) {
      return null;
    }

    rawPayload = decodeBase64Url(encodedPayload);
    decodedPayload = JSON.parse(decoder.decode(rawPayload));

    payload = {
      expiresAt: new Date(decodedPayload['exp']),
      ...(decodedPayload['aud'] && {
        audience: decodedPayload['aud'] as string,
      }),
      ...(decodedPayload['iat'] &&
        typeof decodedPayload['iat'] === 'number' && {
          issuedAt: new Date(decodedPayload['iat']),
        }),
      ...(decodedPayload['iss'] && {
        issuer: decodedPayload['iss'] as string,
      }),
      ...(decodedPayload['jti'] && {
        id: decodedPayload['jti'] as string,
      }),
      ...(decodedPayload['sub'] && {
        subject: decodedPayload['sub'] as string,
      }),
    };

    // the "exp" is the only property that is required by RFC-7519 spec
    if (!payload.expiresAt) {
      return null;
    }
  } catch (error) {
    return null;
  }

  return {
    header,
    payload,
  };
}

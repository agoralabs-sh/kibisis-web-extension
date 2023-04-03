// Types
import { IDecodedJwt, IDecodedJwtHeader, IDecodedJwtPayload } from '../types';

// Utils
import decodeBase64Url from './decodeBase64Url';

export default function decodeJwt(input: string): IDecodedJwt | null {
  const [encodedHeader, encodedPayload] = input.split('.');
  let decodedHeader: Record<string, string>;
  let decodedPayload: Record<string, string | number>;
  let header: IDecodedJwtHeader;
  let payload: IDecodedJwtPayload;

  if (!encodedHeader || !encodedPayload) {
    return null;
  }

  try {
    decodedHeader = JSON.parse(decodeBase64Url(encodedHeader));
    decodedPayload = JSON.parse(decodeBase64Url(encodedPayload));

    header = {
      algorithm: decodedHeader['alg'],
      type: decodedHeader['typ'],
    };

    if (!header.type || !header.algorithm) {
      return null;
    }

    payload = {
      address: decodedPayload['sub'] as string,
      audience: decodedPayload['aud'] as string,
      expiresAt: new Date(decodedPayload['exp']),
      ...(decodedPayload['iat'] &&
        typeof decodedPayload['iat'] === 'number' && {
          issuedAt: new Date(decodedPayload['iat']),
        }),
      ...(decodedPayload['jid'] && {
        id: decodedPayload['jid'] as string,
      }),
    };

    if (!payload.address || !payload.audience || !payload.expiresAt) {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  return {
    header,
    payload,
  };
}

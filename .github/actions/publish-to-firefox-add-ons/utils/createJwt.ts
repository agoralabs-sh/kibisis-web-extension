import { sign } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

// constants
import { JWT_EXPIRY_TIME_IN_SECONDS } from '../constants';

/**
 * Creates a JWT for use as authentication for Firefox Add-on API requests.
 * @param {string} issuer - the token issuer.
 * @param {string} secret - the token secret used to sign the JWT.
 * @returns {string} the encoded JWT.
 */
export default function createJwt(issuer: string, secret: string): string {
  const issuedAt: number = Math.floor(Date.now() / 1000); // in seconds
  const payload: Record<string, string | number> = {
    exp: issuedAt + JWT_EXPIRY_TIME_IN_SECONDS,
    iat: issuedAt,
    iss: issuer,
    jti: uuid(),
  };
  return sign(payload, secret, { algorithm: 'HS256' });
}

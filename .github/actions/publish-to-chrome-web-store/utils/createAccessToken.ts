import axios, { AxiosResponse } from 'axios';

// constants
import { BASE_URL } from '../constants';

// types
import { IAccessTokenResponse } from '../types';

/**
 * Creates an access token to authenticate requests to the Chrome Web Store API.
 * @param {string} clientId - the token issuer.
 * @param {string} clientSecret - the token secret used to sign the JWT.
 * @param {string} refreshToken - the token secret used to sign the JWT.
 * @returns {string} the access token to authenticate requests to the Chrome Web Store API.
 * @see {@link https://developer.chrome.com/docs/webstore/using-api#get-keys}
 */
export default async function createAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<string> {
  const params: URLSearchParams = new URLSearchParams();
  const url: string = `${BASE_URL}/oauth2/v4/token`;
  let response: AxiosResponse<IAccessTokenResponse>;

  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

  response = await axios.post(url, params);

  return response.data.access_token;
}

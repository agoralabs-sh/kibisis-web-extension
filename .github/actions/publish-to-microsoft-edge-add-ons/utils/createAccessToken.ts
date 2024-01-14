import axios, { AxiosResponse } from 'axios';

// types
import { IAccessTokenResponse } from '../types';

/**
 * Creates a new access token to be used to upload and publish.
 * @param {string} accessTokenUrl - the access token URL.
 * @param {string} clientId - the application ID that's assigned to your app.
 * @param {string} clientSecret - the client secret that you generated for your app in the app registration portal.
 * @returns {string} an access token that can be used to upload and publish a new version of the app.
 * @see {@link https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/api/using-addons-api#retrieving-the-access-token}
 */
export default async function createAccessToken(
  accessTokenUrl: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const params: URLSearchParams = new URLSearchParams();
  let response: AxiosResponse<IAccessTokenResponse>;

  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');
  params.append(
    'scope',
    'https://api.addons.microsoftedge.microsoft.com/.default'
  );

  response = await axios.post(accessTokenUrl, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data.access_token;
}

import axios, { AxiosResponse } from 'axios';
import { createReadStream } from 'node:fs';

// constants
import { BASE_URL } from '../constants';

/**
 * Publishes a submission.
 * @param {string} productId - the extension's product ID.
 * @param {string} accessToken - the access token to authorize the request.
 * @returns {string} the operation ID associated with this publish.
 * @see {@link https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/api/using-addons-api#publishing-the-submission}
 */
export default async function publish(
  productId: string,
  accessToken: string
): Promise<string> {
  const url: string = `${BASE_URL}/v1/products/${productId}/submissions`;
  const response: AxiosResponse = await axios.post(
    url,
    { notes: '' },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.headers.location;
}

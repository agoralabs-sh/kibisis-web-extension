import axios, { AxiosResponse } from 'axios';
import { createReadStream } from 'node:fs';

// constants
import { BASE_URL } from '../constants';

// types
import { IUploadResponse } from '../types';

// utils
import createAuthorizationHeader from './createAuthorizationHeader';

/**
 * Uploads the zip file.
 * @param {string} zipPath - the path to the zip file to upload.
 * @param {string} itemId - the item ID.
 * @param {string} accessToken - the access token used to authenticate the request.
 * @returns {Promise<IUploadResponse>} the item resource details.
 * @see {@link https://developer.chrome.com/docs/webstore/api#update}
 */
export default async function uploadZipFile(
  zipPath: string,
  itemId: string,
  accessToken: string
): Promise<IUploadResponse> {
  const url: string = `${BASE_URL}/upload/chromewebstore/v1.1/items/${itemId}
`;
  const response: AxiosResponse<IUploadResponse> = await axios.put(
    url,
    createReadStream(zipPath),
    {
      headers: {
        ['x-goog-api-version']: 2,
        ...createAuthorizationHeader(accessToken),
      },
    }
  );

  return response.data;
}

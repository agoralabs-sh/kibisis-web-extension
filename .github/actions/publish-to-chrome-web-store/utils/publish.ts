import axios from 'axios';

// constants
import { BASE_URL } from '../constants';

// utils
import createAuthorizationHeader from './createAuthorizationHeader';

/**
 * Publishes the submission.
 * @param {string} itemId - the Chrome Web Store item ID.
 * @param {string} accessToken - the access token used to authenticate the request.
 * @see {@link https://developer.chrome.com/docs/webstore/api#publish}
 */
export default async function publish(
  itemId: string,
  accessToken: string
): Promise<void> {
  const url: string = `${BASE_URL}/chromewebstore/v1.1/items/${itemId}/publish`;

  await axios.post(url, undefined, {
    headers: {
      ['Content-Length']: 0,
      ['x-goog-api-version']: 2,
      ...createAuthorizationHeader(accessToken),
    },
  });
}

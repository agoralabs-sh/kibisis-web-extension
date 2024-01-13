import axios from 'axios';

// constants
import { BASE_URL } from '../constants';

// utils
import createAuthorizationHeader from './createAuthorizationHeader';

/**
 * Publishes a submission based on the upload UUID.
 * @param {string} id - the add-on ID.
 * @param {string} uploadUuid - the UUID returned from an uploaded version.
 * @param {string} jwt - a JWT that authenticates the request.
 * @see {@link https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#version-create}
 */
export default async function publish(
  id: string,
  uploadUuid: string,
  jwt: string
): Promise<void> {
  const url: string = `${BASE_URL}/addon/${id}/versions/`;

  await axios.post(
    url,
    {
      upload: uploadUuid,
    },
    {
      headers: createAuthorizationHeader(jwt),
    }
  );
}

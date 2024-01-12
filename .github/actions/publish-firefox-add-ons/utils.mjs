import { debug, setFailed } from '@actions/core';
import axios from 'axios';
import FormData from 'form-data';
import jwt from 'jsonwebtoken';
import { createReadStream } from 'node:fs';

const ERR_ZIP_VALIDATION_FAILED = 2;
const ERR_ZIP_VALIDATION_TIMEOUT = 4;
const ERR_UNKNOWN_HTTP = 254;
const ERR_UNKNOWN = 255;

// https://addons-server.readthedocs.io/en/latest/topics/api/auth.html#create-a-jwt-for-each-request
export function generateJwtToken(jwtIssuer, jwtSecret) {
  const issuedAt = Math.floor(Date.now() / 1000) // remove milliseconds
  const payload = {
    exp: issuedAt + 5 * 60, // set expiration time to 5 minutes
    iat: issuedAt,
    iss: jwtIssuer,
    jti: Math.random().toString()
  }
  return jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
}

export function handleError(error) {
  // HTTP error. This may be a bug on server side.
  if (error.isAxiosError) {
    if (error.response) {
      // got response from firefox api server with status code 4XX or 5XX
      setFailed(`firefox api server responses with error code: ${error.response.status}`);
      setFailed(JSON.stringify(error.response.data))
    } else {
      // incomplete HTTP request may be due to unstable network environment
      setFailed(error.message)
    }

    process.exit(ERR_UNKNOWN_HTTP)
  }

  // unknown error
  debug(JSON.stringify(error));

  setFailed(`unknown error occurred: ${error.message}`);

  process.exit(ERR_UNKNOWN);
}

// https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#version-create
// https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#version-sources
export async function publish(
  id,
  uploadId,
  jwtToken,
) {
  const url = `https://addons.mozilla.org/api/v5/addons/addon/${id}/versions/`;
  await axios.post(
    url,
    {
      upload: uploadId,
    },
    {
      Authorization: `JWT ${jwtToken}`,
    },
  );
}

export async function uploadZipFile(
  zipPath,
  jwtToken,
) {
  const url = 'https://addons.mozilla.org/api/v5/addons/upload/';
  const formData = new FormData();
  let headers;
  let response;

  formData.append('upload', createReadStream(zipPath));
  formData.append('channel', 'listed');

  headers = {
    ...formData.getHeaders(),
    Authorization: `jwt ${jwtToken}`,
  };
  response = await axios.post(url, formData, {
    headers,
  });

  await waitForValidation(response.data.uuid, jwtToken);

  return response.data.uuid;
}

// https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#upload-detail
export async function waitForValidation(id, jwtToken) {
  const MAX_WAIT_TIME = 10 * 60 * 1000; // 10 minutes
  const url = `https://addons.mozilla.org/api/v5/addons/upload/${id}/`
  const endTime = Date.now() + MAX_WAIT_TIME;
  const headers = {
    Authorization: `JWT ${jwtToken}`,
  };
  let response;

  while (Date.now() < endTime) {
    debug('upload not yet validated, waiting 5 seconds...');

    await new Promise(res => setTimeout(res, 5000)); // wait 5 seconds

    debug('checking if upload is validated');

    response = await axios.get(url, { headers });

    if (response.data.processed) {
      if (response.data.valid) {
        return
      }

      setFailed(`zip processed, but invalid: ${JSON.stringify(response.data.validation)}`);

      process.exit(ERR_ZIP_VALIDATION_FAILED);
    }
  }

  process.exit(ERR_ZIP_VALIDATION_TIMEOUT);
}

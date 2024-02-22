import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'node:fs';

// constants
import {
  BASE_URL,
  MAXIMUM_UPLOAD_VALIDATION_TIME_MILLISECONDS,
} from '../constants';

// enums
import { ErrorCodeEnum } from '../enums';

// errors
import { ActionError } from '../errors';

// types
import type { IBaseOptions, IUploadResponse } from '../types';

// utils
import createAuthorizationHeader from './createAuthorizationHeader';
import waitInMilliseconds from './waitInMilliseconds';
import { info } from '@actions/core';

/**
 * Uploads the zip file and waits for validation.
 * @param {string} zipPath - the path to the zip file to upload.
 * @param {string} jwt - the JWT used to authenticate the request.
 * @param {IBaseOptions} options - [optional] various options to customize.
 * @returns {Promise<string>} the ID for the upload.
 * @see {@link https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#upload-create}
 * @see {@link https://addons-server.readthedocs.io/en/latest/topics/api/addons.html#upload-detail}
 */
export default async function uploadZipFile(
  zipPath: string,
  jwt: string,
  { infoLogPrefix }: IBaseOptions
): Promise<string> {
  const url: string = `${BASE_URL}/upload/`;
  const formData: FormData = new FormData();
  const nowInMilliseconds: number = Date.now();
  const pollTime: number = 3000; // 3 seconds
  let isValid: boolean;
  let response: AxiosResponse<IUploadResponse>;
  let uuid: string;

  formData.append('upload', createReadStream(zipPath));
  formData.append('channel', 'listed');

  response = await axios.post(url, formData, {
    headers: {
      ...formData.getHeaders(),
      ...createAuthorizationHeader(jwt),
    },
  });
  isValid = response.data.valid;
  uuid = response.data.uuid;

  // poll to check if upload is valid
  while (
    !isValid &&
    nowInMilliseconds < MAXIMUM_UPLOAD_VALIDATION_TIME_MILLISECONDS
  ) {
    response = await axios.get(`${url}${uuid}`, {
      headers: createAuthorizationHeader(jwt),
    });

    info(`${infoLogPrefix} response: ${JSON.stringify(response.data)}`);

    isValid = response.data.valid;

    await waitInMilliseconds(pollTime);
  }

  // if the upload is still not valid after the while loop has ended, it has timed out
  if (!isValid) {
    throw new ActionError(
      ErrorCodeEnum.UploadValidationTimeoutError,
      `upload validation of zip file "${zipPath}" timed out`
    );
  }

  return uuid;
}

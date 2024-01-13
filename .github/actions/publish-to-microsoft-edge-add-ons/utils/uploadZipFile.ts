import axios, { AxiosResponse } from 'axios';
import { createReadStream } from 'node:fs';

// constants
import { BASE_URL } from '../constants';

// enums
import { ErrorCodeEnum, UploadStatusEnum } from '../enums';

// errors
import { ActionError } from '../errors';

// types
import { IUploadStatusResponse } from '../types';

// utils
import waitInMilliseconds from './waitInMilliseconds';

/**
 * Uploads the zip file to as a draft submission.
 * @param {string} productId - the extension's product ID.
 * @param {string} zipPath - path to the zip file.
 * @param {string} accessToken - the access token to authorize the request.
 * @returns {string} the operation ID associated with this upload.
 * @see {@link https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/api/using-addons-api#uploading-a-package-to-update-an-existing-submission}
 */
export default async function uploadZipFile(
  productId: string,
  zipPath: string,
  accessToken: string
): Promise<string> {
  const authorizationHeader: Record<'Authorization', string> = {
    Authorization: `Bearer ${accessToken}`,
  };
  const pollTime: number = 3000; // 3 seconds
  const retries: number = 5;
  const uploadUrl: string = `${BASE_URL}/v1/products/${productId}/submissions/draft/package`;
  const uploadResponse: AxiosResponse = await axios.post(
    uploadUrl,
    createReadStream(zipPath),
    {
      headers: {
        ...authorizationHeader,
        'Content-Type': 'application/zip',
      },
    }
  );
  let attempts: number = 0;
  let operationId: string;
  let uploadStatusUrl: string;
  let uploadStatusResponse: AxiosResponse<IUploadStatusResponse>;
  let uploadStatus: UploadStatusEnum | null = null;

  operationId = uploadResponse.headers.location;

  if (!operationId) {
    throw new ActionError(
      ErrorCodeEnum.UploadError,
      `failed to get location header from upload response`
    );
  }

  uploadStatusUrl = `${uploadUrl}/operations/${operationId}`;

  // poll the upload status check
  while (uploadStatus !== UploadStatusEnum.Succeeded && attempts < retries) {
    uploadStatusResponse = await axios.get(uploadStatusUrl, {
      headers: {
        ...authorizationHeader,
      },
    });

    switch (uploadStatusResponse.data.status) {
      case UploadStatusEnum.Failed:
        throw new ActionError(
          ErrorCodeEnum.UploadError,
          `failed to get status of uploaded zip file${
            uploadStatusResponse.data.errorCode
              ? ` with code "${uploadStatusResponse.data.errorCode}"`
              : ''
          }: ${
            uploadStatusResponse.data.errors?.join(',') ||
            uploadStatusResponse.data.message
          }`
        );
      case UploadStatusEnum.InProgress:
        await waitInMilliseconds(pollTime);
        break;
      case UploadStatusEnum.Succeeded:
      default:
        break;
    }

    attempts++;
    uploadStatus = uploadStatusResponse.data.status;
  }

  // if we don't have a succeeded status, it probably timed out
  if (uploadStatus !== UploadStatusEnum.Succeeded) {
    throw new ActionError(
      ErrorCodeEnum.UploadError,
      `failed to get status of upload, status returned "${uploadStatus}"`
    );
  }

  return operationId;
}

import { info, setFailed } from '@actions/core';
import { Stats } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';

// enums
import { ErrorCodeEnum } from './enums';

// errors
import { ActionError } from './errors';

// utils
import {
  createAccessToken,
  handleError,
  publish,
  uploadZipFile,
} from './utils';

(async () => {
  let accessToken: string;
  let zipPath: string;
  let zipFileStats: Stats;

  if (!process.env.ITEM_ID) {
    setFailed(`invalid input for environment variable "ITEM_ID"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.CLIENT_ID) {
    setFailed(`invalid input for environment variable "CLIENT_ID"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.CLIENT_SECRET) {
    setFailed(`invalid input for environment variable "CLIENT_SECRET"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.REFRESH_TOKEN) {
    setFailed(`invalid input for environment variable "REFRESH_TOKEN"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.ZIP_FILE_NAME) {
    setFailed(`invalid input for environment variable "ZIP_FILE_NAME"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.GITHUB_WORKSPACE) {
    setFailed(`environment variable "GITHUB_WORKSPACE" not defined`);

    process.exit(ErrorCodeEnum.UnknownError);
  }

  try {
    zipPath = resolve(process.env.GITHUB_WORKSPACE, process.env.ZIP_FILE_NAME);
    zipFileStats = await stat(zipPath);

    // check if the file exists
    if (!zipFileStats.isFile()) {
      throw new ActionError(
        ErrorCodeEnum.FileNotFoundError,
        `zip file "${zipPath}" does not exist`
      );
    }

    info('creating access token...');

    accessToken = await createAccessToken(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REFRESH_TOKEN
    );

    info('access token created');
    info(
      `uploading add-on "${process.env.ITEM_ID}" with zip file "${zipPath}"`
    );

    // await uploadZipFile(zipPath, process.env.ITEM_ID, accessToken);

    info(`successfully uploaded zip file to item "${process.env.ITEM_ID}"`);
    info(`publishing extension: ${process.env.ITEM_ID}`);

    // await publish(process.env.ITEM_ID, accessToken);

    info(`successfully published extension "${process.env.ITEM_ID}"`);
  } catch (error) {
    handleError(error);
  }
})();

import { info, setFailed } from '@actions/core';
import { Stats } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';

// enums
import { ErrorCodeEnum } from './enums';

// errors
import { ActionError } from './errors';

// utils
import { createJwt, handleError, publish, uploadZipFile } from './utils';

(async () => {
  let jwt: string;
  let uploadUuid: string;
  let zipPath: string;
  let zipFileStats: Stats;

  if (!process.env.ADD_ON_ID) {
    setFailed(`invalid input for environment variable "ADD_ON_ID"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.JWT_ISSUER) {
    setFailed(`invalid input for environment variable "JWT_ISSUER"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.JWT_SECRET) {
    setFailed(`invalid input for environment variable "JWT_SECRET"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  if (!process.env.ZIP_FILE_NAME) {
    setFailed(`invalid input for environment variable "ZIP_FILE_NAME"`);

    process.exit(ErrorCodeEnum.InvalidInputError);
  }

  try {
    zipPath = resolve(process.cwd(), process.env.ZIP_FILE_NAME);
    zipFileStats = await stat(zipPath);

    // check if the file exists
    if (!zipFileStats.isFile()) {
      throw new ActionError(
        ErrorCodeEnum.FileNotFoundError,
        `zip file "${zipPath}" does not exist`
      );
    }

    info('creating jwt...');

    jwt = await createJwt(process.env.JWT_ISSUER, process.env.JWT_SECRET);

    info('jwt created');
    info(
      `uploading add-on "${process.env.PRODUCT_ID}" with zip file "${zipPath}"`
    );

    uploadUuid = await uploadZipFile(zipPath, jwt);

    info(`successfully uploaded zip file with uuid "${uploadUuid}"`);
    info(`publishing add-on: ${process.env.ADD_ON_ID}`);

    await publish(process.env.ADD_ON_ID, uploadUuid, jwt);

    info(`successfully published add-on "${process.env.PRODUCT_ID}"`);
  } catch (error) {
    handleError(error);
  }
})();

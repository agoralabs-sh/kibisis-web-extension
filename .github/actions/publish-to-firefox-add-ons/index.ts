import { info, setFailed } from '@actions/core';
import styles from 'ansi-styles';
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
  const infoPrefix: string = `${styles.yellow.open}[INFO]${styles.yellow.close}`;
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

    info(`${infoPrefix} creating jwt...`);

    jwt = createJwt(process.env.JWT_ISSUER, process.env.JWT_SECRET);

    info(`${infoPrefix} jwt created`);
    info(
      `${infoPrefix} uploading add-on "${process.env.PRODUCT_ID}" with zip file "${zipPath}"`
    );

    uploadUuid = await uploadZipFile(zipPath, jwt);

    info(
      `${infoPrefix} successfully uploaded zip file with uuid "${uploadUuid}"`
    );
    info(`${infoPrefix} publishing add-on: ${process.env.ADD_ON_ID}`);

    await publish(process.env.ADD_ON_ID, uploadUuid, jwt);

    info(
      `${infoPrefix} successfully published add-on "${process.env.ADD_ON_ID}"`
    );
  } catch (error) {
    handleError(error);
  }
})();

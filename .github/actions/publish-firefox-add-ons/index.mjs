import { info } from '@actions/core';
import { resolve } from 'node:path';

// utils
import { generateJwtToken, handleError, publish, uploadZipFile } from './utils.mjs';

(async () => {
  const zipPath = resolve(process.cwd(), process.env.ZIP_FILE_NAME);
  let jwtToken;
  let uploadId;

  try {
    info('generating jwt token...');

    jwtToken = generateJwtToken(process.env.JWT_ISSUER, process.env.JWT_SECRET);

    info('jwt token generated');
    info(`uploading zip file from: ${zipPath}`);

    uploadId = await uploadZipFile(zipPath, jwtToken);

    info(`successfully uploaded zip file: ${uploadId}`);
    info(`publishing add-on: ${process.env.ADD_ON_ID}`);

    await publish(process.env.ADD_ON_ID, uploadId, jwtToken);

    info(`successfully published add-on: ${uploadId}`);
  } catch (error) {
    handleError(error);
  }
})();

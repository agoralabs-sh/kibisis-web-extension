import { getInput, info } from '@actions/core';
import axios from 'axios';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// utils
import { generateJwtToken, handleError, publish, uploadZipFile } from './utils.mjs';

(async () => {
  let jwtToken;
  let uploadId;

  try {
    info('generating jwt token...');

    jwtToken = generateJwtToken(process.env.JWT_ISSUER, process.env.JWT_SECRET);

    info('jwt token generated');
    info(`uploading zip file from: ${readdirSync(process.cwd()).join(',')}`);
    info(`uploading zip file from: ${resolve(process.cwd(), process.env.ZIP_PATH)}`);

    info(await axios.get(`https://addons.mozilla.org/api/v5/addons/addon/${process.env.ADD_ON_ID}/`, { Authorization: `JWT ${jwtToken}` }))

    // uploadId = await uploadZipFile(process.env.ZIP_PATH, jwtToken);
    //
    // info(`successfully uploaded zip file: ${uploadId}`);
    // info(`publishing add-on: ${process.env.ADD_ON_ID}`);
    //
    // await publish(process.env.ADD_ON_ID, uploadId, jwtToken);
    //
    // info(`successfully published add-on: ${uploadId}`);
  } catch (error) {
    handleError(error);
  }
})();

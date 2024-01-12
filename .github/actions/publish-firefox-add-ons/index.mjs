import { getInput, info } from '@actions/core';
import axios from 'axios';

// utils
import { generateJwtToken, handleError, publish, uploadZipFile } from './utils.mjs';

(async () => {
  const id = getInput('addon_id', { required: true });
  const zipPath = getInput('zip_path', { required: true });
  const jwtIssuer = getInput('jwt_issuer', { required: true });
  const jwtSecret = getInput('jwt_secret', { required: true });
  let jwtToken;
  let uploadId;

  try {
    info('generating jwt token...');

    jwtToken = generateJwtToken(jwtIssuer, jwtSecret);

    info('jwt token generated');
    info(`uploading zip file from: ${zipPath}`);

    info(await axios.get(`https://addons.mozilla.org/api/v5/addons/addon/${id}/`, { Authorization: `JWT ${jwtToken}` }))

    // uploadId = await uploadZipFile(zipPath, jwtToken);
    //
    // info(`successfully uploaded zip file: ${uploadId}`);
    // info(`publishing add-on: ${id}`);
    //
    // await publish(id, uploadId, jwtToken);
    //
    // info(`successfully published add-on: ${uploadId}`);
  } catch (error) {
    handleError(error);
  }
})();

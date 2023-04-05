import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { decode as decodeHex } from '@stablelib/hex';
import { encodeAddress } from 'algosdk';
import { NavigateFunction } from 'react-router-dom';
import { sign } from 'tweetnacl';
import browser from 'webextension-polyfill';

// Constants
import {
  CREATE_PASSWORD_ROUTE,
  ENTER_MNEMONIC_PHRASE_ROUTE,
} from '../../../constants';

// Enums
import { RegisterThunkEnum } from '../../../enums';

// Errors
import { BaseExtensionError, MalformedDataError } from '../../../errors';

// Features
import { setError } from '../../application';
import { sendRegistrationCompleted } from '../../messages';

// Services
import { PrivateKeyService } from '../../../services/extension';

// Types
import { ILogger, IRegistrationRootState } from '../../../types';

const saveCredentials: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IRegistrationRootState }>(
  RegisterThunkEnum.SaveCredentials,
  async (_, { dispatch, getState }) => {
    const functionName: string = 'saveCredentials';
    const logger: ILogger = getState().application.logger;
    const encryptedPrivateKey: string | null =
      getState().registration.encryptedPrivateKey;
    const name: string | null = getState().registration.name;
    const navigate: NavigateFunction | null = getState().application.navigate;
    const password: string | null = getState().registration.password;
    let error: BaseExtensionError;
    let decryptedPrivateKey: Uint8Array;
    let privateKeyService: PrivateKeyService;
    let publicKey: Uint8Array;

    if (!password) {
      error = new MalformedDataError('no password found');

      logger.error(`${functionName}(): ${error.message}`);

      navigate && navigate(CREATE_PASSWORD_ROUTE);

      throw error;
    }

    if (!encryptedPrivateKey) {
      error = new MalformedDataError('no encrypted private key found');

      logger.error(`${functionName}(): ${error.message}`);

      navigate && navigate(ENTER_MNEMONIC_PHRASE_ROUTE);

      throw error;
    }

    try {
      logger.debug(`${functionName}(): decrypting private key`);

      decryptedPrivateKey = await PrivateKeyService.decrypt(
        decodeHex(encryptedPrivateKey),
        password,
        { logger }
      );

      logger.debug(`${functionName}(): inferring public key`);

      publicKey = sign.keyPair.fromSecretKey(decryptedPrivateKey).publicKey;
      privateKeyService = new PrivateKeyService({
        logger,
        passwordTag: browser.runtime.id,
      });

      logger.debug(
        `${functionName}(): saving account "${encodeAddress(
          publicKey
        )}" to storage`
      );

      // reset any previous credentials, set the password and the account
      await privateKeyService.reset();
      await privateKeyService.setPassword(password);
      await privateKeyService.setAccount(
        {
          privateKey: decryptedPrivateKey,
          publicKey: sign.keyPair.fromSecretKey(decryptedPrivateKey).publicKey,
          ...(name && {
            name,
          }),
        },
        password
      );
    } catch (error) {
      logger.error(`${functionName}(): ${error.message}`);

      dispatch(setError(error));

      throw error;
    }

    logger.debug(`${functionName}(): successfully saved credentials`);

    // send a message that registration has been completed
    dispatch(sendRegistrationCompleted());
  }
);

export default saveCredentials;

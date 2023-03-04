import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Account, mnemonicToSecretKey } from 'algosdk';

// Enums
import { RegisterThunkEnum } from '../../../enums';

// Errors
import { BaseError, MalformedDataError } from '../../../errors';

// Services
import { PrivateKeyService } from '../../../services';

// Types
import { ILogger, IRootState } from '../../../types';

const saveCredentials: AsyncThunk<
  void, // return
  undefined, // args
  Record<string, never>
> = createAsyncThunk<void, undefined, { state: IRootState }>(
  RegisterThunkEnum.SaveCredentials,
  async (_, { getState }) => {
    const functionName: string = 'saveCredentials';
    const logger: ILogger = getState().application.logger;
    const encryptedPrivateKey: string | null =
      getState().register.encryptedPrivateKey;
    const password: string | null = getState().register.password;
    let account: Account;
    let error: BaseError;
    let decryptedPrivateKey: string;
    let privateKeyService: PrivateKeyService;

    if (!password) {
      error = new MalformedDataError('no password found');

      logger.error(`${functionName}(): ${error.message}`);

      // TODO: go back to password screen
      throw error;
    }

    if (!encryptedPrivateKey) {
      error = new MalformedDataError('no encrypted private key found');

      logger.error(`${functionName}(): ${error.message}`);

      // TODO: go back to private key screen
      throw error;
    }

    try {
      logger.debug(`${functionName}(): decrypting private key`);

      decryptedPrivateKey = await PrivateKeyService.decrypt(
        encryptedPrivateKey,
        password,
        { logger }
      );

      logger.debug(`${functionName}(): inferring public key`);

      account = mnemonicToSecretKey(decryptedPrivateKey);
      privateKeyService = new PrivateKeyService({ logger });

      logger.debug(
        `${functionName}(): saving private key to storage for public key "${account.addr}"`
      );

      // reset any previous credentials, set the password and the private key
      await privateKeyService.reset();
      await privateKeyService.setPassword(password);
      await privateKeyService.setPrivateKey(
        account.addr,
        decryptedPrivateKey,
        password
      );
    } catch (error) {
      logger.error(`${functionName}(): ${error.message}`);
      // TODO: handle error

      throw error;
    }

    logger.debug(`${functionName}(): successfully saved credentials`);
  }
);

export default saveCredentials;

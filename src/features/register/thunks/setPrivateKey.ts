import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// Enums
import { RegisterThunkEnum } from '../../../enums';

// Services
import { PrivateKeyService } from '../../../services';

// Types
import { ILogger, IRootState } from '../../../types';

const setPrivateKey: AsyncThunk<
  string | null, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string | null, string, { state: IRootState }>(
  RegisterThunkEnum.SetPrivateKey,
  async (privateKey, { getState }) => {
    const functionName: string = 'setPrivateKey';
    const logger: ILogger = getState().application.logger;
    const password: string | null = getState().register.password;
    let encryptedPrivateKey: string;

    if (!password) {
      logger.error(`${functionName}(): no password found`);

      // TODO: go back to password screen
      return null;
    }

    logger.debug(`${functionName}(): encrypting private key`);

    try {
      encryptedPrivateKey = await PrivateKeyService.encrypt(
        password,
        privateKey,
        { logger }
      );
    } catch (error) {
      logger.error(`${functionName}(): ${error.message}`);

      // TODO: handle encryption error
      return null;
    }

    logger.debug(`${functionName}(): private key successfully encrypted`);

    return encryptedPrivateKey;
  }
);

export default setPrivateKey;

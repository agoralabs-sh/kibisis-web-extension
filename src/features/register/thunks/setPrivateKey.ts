import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { Account, mnemonicToSecretKey } from 'algosdk';
import { NavigateFunction } from 'react-router-dom';

// Enums
import { RegisterThunkEnum } from '../../../enums';

// Constants
import { CREATE_PASSWORD_ROUTE } from '../../../constants';

// Features
import { setError } from '../../application';
import { setName } from '../slice';

// Services
import { PrivateKeyService } from '../../../services';

// Types
import { ILogger, IRegistrationRootState } from '../../../types';
import { BaseError, MalformedDataError } from '../../../errors';

const setPrivateKey: AsyncThunk<
  string | null, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string | null, string, { state: IRegistrationRootState }>(
  RegisterThunkEnum.SetPrivateKey,
  async (privateKey, { dispatch, getState }) => {
    const functionName: string = 'setPrivateKey';
    const logger: ILogger = getState().application.logger;
    const navigate: NavigateFunction | null = getState().application.navigate;
    const password: string | null = getState().register.password;
    let account: Account;
    let encryptedPrivateKey: string;
    let error: BaseError;

    if (!password) {
      error = new MalformedDataError('no password found');

      logger.error(`${functionName}(): ${error.message}`);

      navigate && navigate(CREATE_PASSWORD_ROUTE);

      throw error;
    }

    logger.debug(`${functionName}(): encrypting private key`);

    try {
      account = mnemonicToSecretKey(privateKey);
      encryptedPrivateKey = await PrivateKeyService.encrypt(
        password,
        privateKey,
        { logger }
      );
    } catch (error) {
      logger.error(`${functionName}(): ${error.message}`);

      dispatch(setError(error));

      throw error;
    }

    logger.debug(`${functionName}(): private key successfully encrypted`);

    dispatch(setName(account.addr));

    return encryptedPrivateKey;
  }
);

export default setPrivateKey;

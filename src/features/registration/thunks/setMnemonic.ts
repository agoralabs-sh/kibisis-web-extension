import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeHex } from '@stablelib/hex';
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
import { PrivateKeyService } from '../../../services/extension';

// Types
import { ILogger, IRegistrationRootState } from '../../../types';
import { BaseExtensionError, MalformedDataError } from '../../../errors';

const setMnemonic: AsyncThunk<
  string | null, // return
  string, // args
  Record<string, never>
> = createAsyncThunk<string | null, string, { state: IRegistrationRootState }>(
  RegisterThunkEnum.SetMnemonic,
  async (mnemonic, { dispatch, getState }) => {
    const functionName: string = 'setMnemonic';
    const logger: ILogger = getState().application.logger;
    const navigate: NavigateFunction | null = getState().application.navigate;
    const password: string | null = getState().registration.password;
    let account: Account;
    let encryptedPrivateKey: Uint8Array;
    let error: BaseExtensionError;

    if (!password) {
      error = new MalformedDataError('no password found');

      logger.error(`${functionName}(): ${error.message}`);

      navigate && navigate(CREATE_PASSWORD_ROUTE);

      throw error;
    }

    logger.debug(`${functionName}(): encrypting private key`);

    try {
      account = mnemonicToSecretKey(mnemonic);
      encryptedPrivateKey = await PrivateKeyService.encrypt(
        account.sk,
        password,
        { logger }
      );
    } catch (error) {
      logger.error(`${functionName}(): ${error.message}`);

      dispatch(setError(error));

      throw error;
    }

    logger.debug(`${functionName}(): private key successfully encrypted`);

    dispatch(setName(account.addr));

    // encode in hexadecimal as redux screams about serialization of byte arrays
    return encodeHex(encryptedPrivateKey);
  }
);

export default setMnemonic;

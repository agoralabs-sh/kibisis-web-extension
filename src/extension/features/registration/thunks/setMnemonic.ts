import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { encode as encodeHex } from '@stablelib/hex';
import { Account, mnemonicToSecretKey } from 'algosdk';
import { NavigateFunction } from 'react-router-dom';

// Constants
import { CREATE_PASSWORD_ROUTE } from '@extension/constants';

// Enums
import { RegisterThunkEnum } from '@extension/enums';

// Errors
import { BaseExtensionError, MalformedDataError } from '@extension/errors';

// Features
import { setError } from '@extension/features/application';
import { setName } from '../slice';

// Services
import { PrivateKeyService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IRegistrationRootState } from '@extension/types';

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

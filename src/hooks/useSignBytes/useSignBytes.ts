import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import {
  Account,
  signBytes as algoSignBytes,
  mnemonicToSecretKey,
} from 'algosdk';
import { useState } from 'react';

// Errors
import {
  BaseExtensionError,
  DecryptionError,
  MalformedDataError,
} from '../../errors';

// Selectors
import { useSelectLogger } from '../../selectors';

// Services
import { PrivateKeyService } from '../../services/extension';

// Types
import { ILogger } from '../../types';
import { ISignBytesOptions, IUseSignBytesState } from './types';

export default function useSignBytes(): IUseSignBytesState {
  const logger: ILogger = useSelectLogger();
  const [encodedSignedBytes, setEncodedSignedBytes] = useState<string | null>(
    null
  );
  const [signError, setSignError] = useState<BaseExtensionError | null>(null);
  const signBytes: (options: ISignBytesOptions) => Promise<void> = async ({
    encodedData,
    password,
    signer,
  }: ISignBytesOptions) => {
    const functionName: string = 'signBytes';
    const privateKeyService: PrivateKeyService = new PrivateKeyService({
      logger,
      passwordTag: __EXTENSION_ID__,
    });
    let account: Account;
    let bytes: Uint8Array;
    let privateKey: string | null;
    let signedBytes: Uint8Array;

    setSignError(null);

    try {
      bytes = decodeBase64(encodedData);
    } catch (error) {
      logger.debug(`useSignBytes#${functionName}(): ${error.message}`);

      return setSignError(error);
    }

    logger.debug(
      `useSignBytes#${functionName}(): converted base64 data to bytes`
    );

    try {
      privateKey = await privateKeyService.getPrivateKey(signer, password);

      if (!privateKey) {
        throw new DecryptionError(
          `failed to get private key for signer "${signer}"`
        );
      }
    } catch (error) {
      logger.debug(`useSignBytes#${functionName}(): ${error.message}`);

      return setSignError(error);
    }

    logger.debug(
      `useSignBytes#${functionName}(): decrypted private key for "${signer}"`
    );

    try {
      account = mnemonicToSecretKey(privateKey);
      signedBytes = algoSignBytes(bytes, account.sk);

      logger.debug(
        `useSignBytes#${functionName}(): signed bytes with signer "${signer}"`
      );

      setEncodedSignedBytes(encodeBase64(signedBytes));
    } catch (error) {
      logger.debug(`useSignBytes#${functionName}(): ${error.message}`);

      if (!(error as BaseExtensionError).code) {
        return setSignError(new MalformedDataError(error.message));
      }

      return setSignError(error);
    }
  };

  return {
    encodedSignedBytes,
    error: signError,
    resetError: () => setSignError(null),
    signBytes,
  };
}

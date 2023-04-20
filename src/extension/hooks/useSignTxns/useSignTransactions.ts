import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import { Address, decodeAddress, signBytes as algoSignBytes } from 'algosdk';
import { useState } from 'react';
import browser from 'webextension-polyfill';

// Errors
import {
  BaseExtensionError,
  DecryptionError,
  MalformedDataError,
} from '@extension/errors';

// Selectors
import { useSelectLogger } from '@extension/selectors';

// Services
import { PrivateKeyService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { ISignBytesOptions, IUseSignTransactionsState } from './types';

export default function useSignTransactions(): IUseSignTransactionsState {
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
      passwordTag: browser.runtime.id,
    });
    let decodedAddress: Address;
    let bytes: Uint8Array;
    let privateKey: Uint8Array | null;
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
      decodedAddress = decodeAddress(signer);
      privateKey = await privateKeyService.getPrivateKey(
        decodedAddress.publicKey,
        password
      );

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
      signedBytes = algoSignBytes(bytes, privateKey);

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

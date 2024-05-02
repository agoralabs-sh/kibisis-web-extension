import { ARC0027UnauthorizedSignerError } from '@agoralabs-sh/avm-web-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import {
  encodeAddress,
  signTransaction as algoSignTransaction,
  Transaction,
} from 'algosdk';
import browser from 'webextension-polyfill';

// errors
import {
  DecryptionError,
  InvalidPasswordError,
  MalformedDataError,
} from '@extension/errors';

// services
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IOptions } from './types';

// utils
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';

/**
 * Convenience function that signs a group of transactions.
 * @param {IOptions} options - the base64 encoded transactions, the authorized signers and the password.
 * @returns {Promise<(string | null)[]>} the signed transactions.
 * @throws {MalformedDataError} if the data could not be decoded or the signer addresses are malformed.
 * @throws {DecryptionError} if there was a problem decrypting the private keys with the password.
 * @throws {InvalidPasswordError} if the password is not valid.
 */
export default async function signTransactions({
  authorizedSigners,
  logger,
  password,
  txns,
}: IOptions): Promise<(string | null)[]> {
  const _functionName: string = 'signTransactions';
  const privateKeyService: PrivateKeyService = new PrivateKeyService({
    logger,
    passwordTag: browser.runtime.id,
  });
  const isValidPassword: boolean = await privateKeyService.verifyPassword(
    password
  );
  let errorMessage: string;

  // first check the password is correct
  if (!isValidPassword) {
    throw new InvalidPasswordError();
  }

  return await Promise.all(
    txns.map(async (txn) => {
      const unsignedTransaction: Transaction = decodeUnsignedTransaction(
        decodeBase64(txn.txn)
      );
      let privateKey: Uint8Array | null;
      let signer: string;

      // if we have an empty signers array, we will skip as per:
      // {@link https://algorand-provider.agoralabs.sh/getting-started/dapps/signing-transactions#non-wallet-signed-transactions}
      if (txn.signers && txn.signers.length <= 0) {
        logger?.debug(
          `${_functionName}: skipping transaction "${unsignedTransaction.txID()}" due to empty signers array`
        );

        return txn.stxn || null; // if the signed transaction exists, return it, or null
      }

      try {
        signer = encodeAddress(unsignedTransaction.from.publicKey);
      } catch (error) {
        logger?.error(`${_functionName}: ${error.message}`);

        throw new MalformedDataError(error.message);
      }

      // if no authorized address matches the signer, we cannot sign
      if (!authorizedSigners.some((value) => value === signer)) {
        // if there is no signed transaction, we have been instructed to sign, so error
        if (!txn.stxn) {
          throw new ARC0027UnauthorizedSignerError({
            message: `signer "${signer}" not authorized to sign transaction "${unsignedTransaction.txID()}"`,
            providerId: __PROVIDER_ID__,
            signer,
          });
        }

        logger?.debug(
          `${_functionName}: from address "${signer}" has not been authorized to sign transaction, skipping`
        );

        // this is a signed transaction, so ignore
        return null;
      }

      privateKey = await privateKeyService.getDecryptedPrivateKey(
        unsignedTransaction.from.publicKey,
        password
      );

      if (!privateKey) {
        errorMessage = `failed to get private key for signer "${signer}"`;

        logger?.error(`${_functionName}: ${errorMessage}`);

        throw new DecryptionError(errorMessage);
      }

      try {
        const { blob, txID } = algoSignTransaction(
          unsignedTransaction,
          privateKey
        );

        logger?.debug(
          `${_functionName}: successfully signed transaction "${txID}" with signer "${signer}"`
        );

        return encodeBase64(blob);
      } catch (error) {
        logger?.error(`${_functionName}: ${error.message}`);

        throw new MalformedDataError(error.message);
      }
    })
  );
}

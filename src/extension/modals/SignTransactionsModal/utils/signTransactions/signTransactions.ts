import { ARC0027UnauthorizedSignerError } from '@agoralabs-sh/avm-web-provider';
import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import type { Transaction } from 'algosdk';

// errors
import { MalformedDataError } from '@extension/errors';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { TOptions } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import decodeUnsignedTransaction from '@extension/utils/decodeUnsignedTransaction';
import signTransaction from '@extension/utils/signTransaction';

/**
 * Convenience function that signs a group of transactions.
 * @param {IOptions} options - the base64 encoded transactions, the authorized signers and the password.
 * @returns {Promise<(string | null)[]>} the signed transactions.
 * @throws {MalformedDataError} if the data could not be decoded or the signer addresses are malformed.
 * @throws {DecryptionError} if there was a problem decrypting the private keys with the password.
 * @throws {InvalidPasswordError} if the password is not valid.
 */
export default async function signTransactions({
  accounts,
  arc0001Transactions,
  authAccounts,
  logger,
  networks,
  ...encryptionOptions
}: TOptions): Promise<(string | null)[]> {
  const _functionName: string = 'signTransactions';

  return await Promise.all(
    arc0001Transactions.map(async (arc001Transaction) => {
      const unsignedTransaction: Transaction = decodeUnsignedTransaction(
        decodeBase64(arc001Transaction.txn)
      );
      let signedTransaction: Uint8Array;
      let signerAddress: string;

      // if we have an empty signers array, we will skip as per:
      // {@link https://algorand-provider.agoralabs.sh/getting-started/dapps/signing-transactions#non-wallet-signed-transactions}
      if (arc001Transaction.signers && arc001Transaction.signers.length <= 0) {
        logger?.debug(
          `${_functionName}: skipping transaction "${unsignedTransaction.txID()}" due to empty signers array`
        );

        return arc001Transaction.stxn || null; // if the signed transaction exists, return it, or null
      }

      try {
        signerAddress = convertPublicKeyToAVMAddress(
          unsignedTransaction.from.publicKey
        );
      } catch (error) {
        logger?.error(`${_functionName}: ${error.message}`);

        throw new MalformedDataError(error.message);
      }

      // if no authorized address matches the signer, we cannot sign
      if (
        !accounts.some(
          (value) =>
            value.publicKey ===
            AccountRepository.encode(unsignedTransaction.from.publicKey)
        )
      ) {
        // if there is no signed transaction, we have been instructed to sign, so error
        if (!arc001Transaction.stxn) {
          throw new ARC0027UnauthorizedSignerError({
            message: `signer "${signerAddress}" not authorized to sign transaction "${unsignedTransaction.txID()}"`,
            providerId: __PROVIDER_ID__,
            signer: signerAddress,
          });
        }

        logger?.debug(
          `${_functionName}: from address "${signerAddress}" has not been authorized to sign transaction, skipping`
        );

        // this is a signed transaction, so ignore
        return null;
      }

      try {
        signedTransaction = await signTransaction({
          ...encryptionOptions,
          accounts,
          authAccounts,
          logger,
          networks,
          unsignedTransaction,
        });

        logger?.debug(
          `${_functionName}: successfully signed transaction "${unsignedTransaction.txID()}" for signer "${signerAddress}"`
        );

        return encodeBase64(signedTransaction);
      } catch (error) {
        logger?.error(`${_functionName}: ${error.message}`);

        throw new MalformedDataError(error.message);
      }
    })
  );
}

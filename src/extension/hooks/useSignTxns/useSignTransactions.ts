import {
  decode as decodeBase64,
  encode as encodeBase64,
} from '@stablelib/base64';
import {
  decodeUnsignedTransaction,
  encodeAddress,
  signTransaction as algoSignTransaction,
  Transaction,
} from 'algosdk';
import { useState } from 'react';
import browser from 'webextension-polyfill';

// Errors
import {
  BaseExtensionError,
  DecryptionError,
  InvalidPasswordError,
  MalformedDataError,
} from '@extension/errors';

// Selectors
import { useSelectLogger } from '@extension/selectors';

// Services
import { PrivateKeyService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { ISignTransactionsOptions, IUseSignTransactionsState } from './types';

export default function useSignTransactions(): IUseSignTransactionsState {
  const logger: ILogger = useSelectLogger();
  const [encodedSignedTransactions, setEncodedSignedTransactions] = useState<
    (string | null)[]
  >([]);
  const [signError, setSignError] = useState<BaseExtensionError | null>(null);
  const signTransactions: (
    options: ISignTransactionsOptions
  ) => Promise<void> = async ({
    authorizedAddresses,
    password,
    transactions,
  }: ISignTransactionsOptions) => {
    const privateKeyService: PrivateKeyService = new PrivateKeyService({
      logger,
      passwordTag: browser.runtime.id,
    });
    let signedTransactions: (string | null)[];
    let isValidPassword: boolean;

    setSignError(null);

    isValidPassword = await privateKeyService.verifyPassword(password);

    // first check the password is correct
    if (!isValidPassword) {
      return setSignError(new InvalidPasswordError());
    }

    try {
      signedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          const unsignedTransaction: Transaction = decodeUnsignedTransaction(
            decodeBase64(transaction.txn)
          );
          let privateKey: Uint8Array | null;
          let signer: string;

          // if we have an empty signers array, we will skip as per:
          // {@link https://algorand-provider.agoralabs.sh/getting-started/dapps/signing-transactions#non-wallet-signed-transactions}
          if (transaction.signers && transaction.signers.length <= 0) {
            logger.debug(
              `${useSignTransactions.name}#${
                signTransactions.name
              }(): skipping transaction "${unsignedTransaction.txID()}" due to empty signers array`
            );

            return transaction.stxn || null; // if the signed transaction exists, return it, or null
          }

          signer = encodeAddress(unsignedTransaction.from.publicKey);

          // if no authorized address matches the signer, we cannot sign
          if (!authorizedAddresses.some((value) => value === signer)) {
            logger.debug(
              `${useSignTransactions.name}#${signTransactions.name}(): from address "${signer}" has not been authorized to sign transaction, skipping`
            );

            return null;
          }

          privateKey = await privateKeyService.getPrivateKey(
            unsignedTransaction.from.publicKey,
            password
          );

          if (!privateKey) {
            throw new DecryptionError(
              `failed to get private key for signer "${signer}"`
            );
          }

          const { blob, txID } = algoSignTransaction(
            unsignedTransaction,
            privateKey
          );

          logger.debug(
            `${useSignTransactions.name}#${signTransactions.name}(): successfully signed transaction "${txID}" with signer "${signer}"`
          );

          return encodeBase64(blob);
        })
      );

      setEncodedSignedTransactions(signedTransactions);
    } catch (error) {
      logger.debug(
        `${useSignTransactions.name}#${signTransactions.name}(): ${error.message}`
      );

      return setSignError(error);
    }
  };

  return {
    encodedSignedTransactions,
    error: signError,
    resetError: () => setSignError(null),
    signTransactions,
  };
}

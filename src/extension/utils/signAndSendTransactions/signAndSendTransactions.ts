import { Algodv2, IntDecoding, waitForConfirmation } from 'algosdk';
import browser from 'webextension-polyfill';

// constants
import { TRANSACTION_CONFIRMATION_ROUNDS } from '@extension/constants';

// errors
import {
  DecryptionError,
  InvalidPasswordError,
  MalformedDataError,
} from '@extension/errors';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IAlgorandPendingTransactionResponse } from '@extension/types';
import type { IOptions } from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';

/**
 * Convenience function that signs and sends unsigned transactions.
 * @param {IOptions} options - the fields needed sign and send the transactions.
 * @returns {string[]} the transaction IDs.
 */
export default async function signAndSendTransactions({
  logger,
  network,
  password,
  unsignedTransactions,
}: IOptions): Promise<string[]> {
  const _functionName: string = 'signAndSendTransactions';
  const privateKeyService = new PrivateKeyService({
    logger,
    passwordTag: browser.runtime.id,
  });
  const isValidPassword = await privateKeyService.verifyPassword(password);
  let algodClient: Algodv2;
  let errorMessage: string;
  let sentRawTransaction: { txId: string };
  let signedTransactions: Uint8Array[];
  let transactionsResponse: IAlgorandPendingTransactionResponse;

  // first check the password is correct
  if (!isValidPassword) {
    throw new InvalidPasswordError();
  }

  logger?.debug(
    `${_functionName}: signing transactions "[${unsignedTransactions
      .map((value) => value.type)
      .join(',')}]"`
  );

  algodClient = createAlgodClient(network, { logger });
  signedTransactions = await Promise.all(
    unsignedTransactions.map(async (value) => {
      const privateKey = await privateKeyService.getDecryptedPrivateKey(
        value.from.publicKey,
        password
      );

      if (!privateKey) {
        errorMessage = `failed to get private key for signer "${AccountService.convertPublicKeyToAlgorandAddress(
          AccountService.encodePublicKey(value.from.publicKey)
        )}"`;

        logger?.error(`${_functionName}: ${errorMessage}`);

        throw new DecryptionError(errorMessage);
      }

      try {
        return value.signTxn(privateKey);
      } catch (error) {
        logger?.error(`${_functionName}: ${error.message}`);

        throw new MalformedDataError(error.message);
      }
    })
  );

  logger?.debug(
    `${_functionName}: sending transactions to the network "${network.genesisId}"`
  );

  sentRawTransaction = await algodClient
    .sendRawTransaction(signedTransactions)
    .setIntDecoding(IntDecoding.BIGINT)
    .do();

  logger?.debug(
    `${_functionName}: transaction "${sentRawTransaction.txId}" sent to the network "${network.genesisId}", confirming`
  );

  transactionsResponse = (await waitForConfirmation(
    algodClient,
    sentRawTransaction.txId,
    TRANSACTION_CONFIRMATION_ROUNDS
  )) as IAlgorandPendingTransactionResponse;

  logger?.debug(
    `${_functionName}: transaction "${sentRawTransaction.txId}" confirmed in round "${transactionsResponse['confirmed-round']}"`
  );

  return unsignedTransactions.map((value) => value.txID());
}

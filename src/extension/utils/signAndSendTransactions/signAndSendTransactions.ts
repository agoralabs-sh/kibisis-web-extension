import {
  Algodv2,
  encodeAddress,
  IntDecoding,
  waitForConfirmation,
} from 'algosdk';
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
import type {
  IAccountInformation,
  IAccountWithExtendedProps,
  IAlgorandPendingTransactionResponse,
} from '@extension/types';
import type { IOptions } from './types';

// utils
import createAlgodClient from '@common/utils/createAlgodClient';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

/**
 * Convenience function that signs and sends unsigned transactions.
 * @param {IOptions} options - the fields needed sign and send the transactions.
 * @returns {string[]} the transaction IDs.
 */
export default async function signAndSendTransactions({
  accounts,
  logger,
  network,
  password,
  unsignedTransactions,
}: IOptions): Promise<string[]> {
  const _functionName = 'signAndSendTransactions';
  const privateKeyService = new PrivateKeyService({
    logger,
    passwordTag: browser.runtime.id,
  });
  const isValidPassword = await privateKeyService.verifyPassword(password);
  let _error: string;
  let algodClient: Algodv2;
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
    unsignedTransactions.map(async (transaction) => {
      const signerAddress = encodeAddress(transaction.from.publicKey);
      let account: IAccountWithExtendedProps | null;
      let accountInformation: IAccountInformation | null;
      let authAccount: IAccountWithExtendedProps | null;
      let privateKey: Uint8Array | null;

      if (
        convertGenesisHashToHex(transaction.genesisHash.toString('base64')) !==
        network.genesisHash
      ) {
        _error = `transaction "${transaction.txID()}" genesis hash mismatch, "${
          network.genesisId
        }" expected, "${transaction.genesisHash.toString('base64')}" used`;

        logger?.error(`${_functionName}: ${_error}`);

        throw new MalformedDataError(_error);
      }

      account =
        accounts.find(
          (value) =>
            value.publicKey ===
            AccountService.encodePublicKey(transaction.from.publicKey)
        ) || null;

      if (!account) {
        _error = `signer "${signerAddress}" is not present`;

        logger?.error(`${_functionName}: ${_error}`);

        throw new MalformedDataError(_error);
      }

      accountInformation = AccountService.extractAccountInformationForNetwork(
        account,
        network
      );

      if (!accountInformation) {
        _error = `unable to get account information for "${signerAddress}" on network "${network.genesisId}"`;

        logger?.error(`${_functionName}: ${_error}`);

        throw new MalformedDataError(_error);
      }

      privateKey = await privateKeyService.getDecryptedPrivateKey(
        transaction.from.publicKey,
        password
      );

      // if the account is re-keyed, attempt to get the auth account's private key to sign
      if (accountInformation.authAddress) {
        authAccount =
          accounts.find(
            (value) =>
              accountInformation?.authAddress &&
              value.publicKey ===
                AccountService.convertAlgorandAddressToPublicKey(
                  accountInformation.authAddress
                )
          ) || null;

        if (!authAccount) {
          _error = `failed to get private key for auth address "${accountInformation.authAddress}"`;

          logger?.error(`${_functionName}: ${_error}`);

          throw new MalformedDataError(_error);
        }

        privateKey = await privateKeyService.getDecryptedPrivateKey(
          AccountService.decodePublicKey(authAccount.publicKey),
          password
        );
      }

      if (!privateKey) {
        _error = `failed to get private key for ${
          accountInformation.authAddress
            ? `the re-keyed account "${signerAddress}" with auth address "${accountInformation.authAddress}"`
            : `signer "${signerAddress}"`
        }`;

        logger?.error(`${_functionName}: ${_error}`);

        throw new MalformedDataError(_error);
      }

      try {
        return transaction.signTxn(privateKey);
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

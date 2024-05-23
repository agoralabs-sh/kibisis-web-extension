import { encode as encodeBase64 } from '@stablelib/base64';
import { encodeAddress } from 'algosdk';
import browser from 'webextension-polyfill';

// errors
import { MalformedDataError } from '@extension/errors';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccountInformation,
  IAccountWithExtendedProps,
} from '@extension/types';
import type { IOptions } from './types';

/**
 * Convenience function that signs a transactions for a given network.
 * @param {IOptions} options - the unsigned transaction, the network, the available accounts and the password.
 * @returns {Promise<Uint8Array>} a promise that resolves to the signed transaction.
 * @throws {DecryptionError} if there was a problem decrypting the private keys with the password.
 * @throws {InvalidPasswordError} if the password is not valid.
 * @throws {MalformedDataError} if the data could not be decoded or the signer address is malformed.
 */
export default async function signTransaction({
  accounts,
  authAccounts = [],
  logger,
  networks,
  password,
  unsignedTransaction,
}: IOptions): Promise<Uint8Array> {
  const _functionName = 'signTransaction';
  const base64EncodedGenesisHash = encodeBase64(
    unsignedTransaction.genesisHash
  );
  const privateKeyService = new PrivateKeyService({
    logger,
    passwordTag: browser.runtime.id,
  });
  const network =
    networks.find((value) => value.genesisHash === base64EncodedGenesisHash) ||
    null;
  const signerAddress = encodeAddress(unsignedTransaction.from.publicKey);
  let _error: string;
  let account: IAccountWithExtendedProps | null;
  let accountInformation: IAccountInformation | null;
  let authAccount: IAccountWithExtendedProps | null;
  let privateKey: Uint8Array | null;

  logger?.debug(
    `${_functionName}: signing transaction "${unsignedTransaction.txID()}"`
  );

  if (!network) {
    _error = `network "${
      unsignedTransaction.genesisID
    }" for transaction "${unsignedTransaction.txID()}" not supported`;

    logger?.error(`${_functionName}: ${_error}`);

    throw new MalformedDataError(_error);
  }

  account =
    accounts.find(
      (value) =>
        value.publicKey ===
        AccountService.encodePublicKey(unsignedTransaction.from.publicKey)
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
    unsignedTransaction.from.publicKey,
    password
  );

  // if the account is re-keyed, attempt to get the auth account's private key to sign
  if (accountInformation.authAddress) {
    authAccount =
      authAccounts.find(
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
    return unsignedTransaction.signTxn(privateKey);
  } catch (error) {
    logger?.error(`${_functionName}: ${error.message}`);

    throw new MalformedDataError(error.message);
  }
}

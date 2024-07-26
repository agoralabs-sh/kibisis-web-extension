import { encode as encodeBase64 } from '@stablelib/base64';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { MalformedDataError } from '@extension/errors';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// services
import AccountService from '@extension/services/AccountService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccountInformation,
  IAccountWithExtendedProps,
} from '@extension/types';
import type { TOptions } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import fetchDecryptedKeyPairFromStorageWithPasskey from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPasskey';
import fetchDecryptedKeyPairFromStorageWithPassword from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPassword';

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
  unsignedTransaction,
  ...encryptionOptions
}: TOptions): Promise<Uint8Array> {
  const _functionName = 'signTransaction';
  const base64EncodedGenesisHash = encodeBase64(
    unsignedTransaction.genesisHash
  );
  const network =
    networks.find((value) => value.genesisHash === base64EncodedGenesisHash) ||
    null;
  const signerAddress = convertPublicKeyToAVMAddress(
    unsignedTransaction.from.publicKey
  );
  let _error: string;
  let account: IAccountWithExtendedProps | null;
  let accountInformation: IAccountInformation | null;
  let authAccount: IAccountWithExtendedProps | null;
  let keyPair: Ed21559KeyPair | null = null;
  let publicKey: string | Uint8Array = unsignedTransaction.from.publicKey;

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
        PrivateKeyService.encode(unsignedTransaction.from.publicKey)
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

  // if the account is re-keyed, attempt to get the auth account's private key to sign
  if (accountInformation.authAddress) {
    authAccount =
      authAccounts.find(
        (value) =>
          accountInformation?.authAddress &&
          value.publicKey ===
            convertPublicKeyToAVMAddress(accountInformation.authAddress)
      ) || null;

    if (!authAccount) {
      _error = `failed to get private key for auth address "${accountInformation.authAddress}"`;

      logger?.error(`${_functionName}: ${_error}`);

      throw new MalformedDataError(_error);
    }

    publicKey = authAccount.publicKey;
  }

  logger?.debug(
    `${_functionName}: decrypting private key using "${encryptionOptions.type}" encryption method`
  );

  if (encryptionOptions.type === EncryptionMethodEnum.Password) {
    keyPair = await fetchDecryptedKeyPairFromStorageWithPassword({
      logger,
      password: encryptionOptions.password,
      publicKey,
    });
  }

  if (encryptionOptions.type === EncryptionMethodEnum.Passkey) {
    keyPair = await fetchDecryptedKeyPairFromStorageWithPasskey({
      inputKeyMaterial: encryptionOptions.inputKeyMaterial,
      logger,
      publicKey,
    });
  }

  if (!keyPair) {
    _error = `failed to get private key for ${
      accountInformation.authAddress
        ? `the re-keyed account "${signerAddress}" with auth address "${accountInformation.authAddress}"`
        : `signer "${signerAddress}"`
    }`;

    logger?.error(`${_functionName}: ${_error}`);

    throw new MalformedDataError(_error);
  }

  try {
    return unsignedTransaction.signTxn(keyPair.getSecretKey());
  } catch (error) {
    logger?.error(`${_functionName}:`, error);

    throw new MalformedDataError(error.message);
  }
}

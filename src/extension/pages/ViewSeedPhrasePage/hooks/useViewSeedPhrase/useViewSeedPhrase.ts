import { useState } from 'react';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// errors
import { DecryptionError } from '@extension/errors';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { IAccountAndSeedPhraseValue } from '../../types';
import type { IDecryptSeedPhraseActionOptions, IState } from './types';

// utils
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import convertPrivateKeyToSeedPhrase from '@extension/utils/convertPrivateKeyToSeedPhrase';
import createMaskedSeedPhrase from '@extension/utils/createMaskedSeedPhrase';
import fetchDecryptedKeyPairFromStorageWithPasskey from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPasskey';
import fetchDecryptedKeyPairFromStorageWithPassword from '@extension/utils/fetchDecryptedKeyPairFromStorageWithPassword';
import fetchDecryptedKeyPairFromStorageWithUnencrypted from '@extension/utils/fetchDecryptedKeyPairFromStorageWithUnencrypted';

export default function useViewSeedPhrase(): IState {
  // selectors
  const logger = useSelectLogger();
  // states
  const [decrypting, setDecrypting] = useState<boolean>(false);
  // actions
  const decryptSeedPhraseAction = async ({
    account,
    credentials,
    onError,
  }: IDecryptSeedPhraseActionOptions): Promise<IAccountAndSeedPhraseValue> => {
    const _functionName = 'decryptSeedPhraseAction';
    let keyPair: Ed21559KeyPair | null = null;

    if (!credentials) {
      return {
        account,
        masked: true,
        seedPhrase: createMaskedSeedPhrase(),
      };
    }

    setDecrypting(true);

    // get the private key
    try {
      switch (credentials.type) {
        case EncryptionMethodEnum.Passkey:
          keyPair = await fetchDecryptedKeyPairFromStorageWithPasskey({
            inputKeyMaterial: credentials.inputKeyMaterial,
            logger,
            publicKey: account.publicKey,
          });

          break;
        case EncryptionMethodEnum.Password:
          keyPair = await fetchDecryptedKeyPairFromStorageWithPassword({
            logger,
            password: credentials.password,
            publicKey: account.publicKey,
          });

          break;
        case EncryptionMethodEnum.Unencrypted:
          keyPair = await fetchDecryptedKeyPairFromStorageWithUnencrypted({
            logger,
            publicKey: account.publicKey,
          });

          break;
        default:
          break;
      }

      if (!keyPair) {
        throw new DecryptionError(
          `failed to get private key for account "${convertPublicKeyToAVMAddress(
            account.publicKey
          )}"`
        );
      }

      setDecrypting(false);

      // convert the private key to the seed phrase
      return {
        account,
        masked: false,
        seedPhrase: convertPrivateKeyToSeedPhrase({
          logger,
          privateKey: keyPair.privateKey,
        }),
      };
    } catch (error) {
      logger?.error(`${_functionName}:`, error);

      onError(error);
      setDecrypting(false);

      return {
        account,
        masked: true,
        seedPhrase: createMaskedSeedPhrase(),
      };
    }
  };

  return {
    decrypting,
    decryptSeedPhraseAction,
  };
}

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import browser from 'webextension-polyfill';

// errors
import { BaseExtensionError, InvalidPasswordError } from '@extension/errors';

// features
import { removeFromStorageThunk as removePasskeyToStorageThunk } from '@extension/features/passkeys';

// selectors
import { useSelectLogger } from '@extension/selectors';

// managers
import PasskeyManager from '@extension/managers/PasskeyManager';
import PasswordManager from '@extension/managers/PasswordManager';

// repositories
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IEncryptionState } from '@extension/components/ReEncryptKeysLoadingContent';
import type {
  IAppThunkDispatch,
  IMainRootState,
  IPrivateKey,
} from '@extension/types';
import type { IRemovePasskeyActionOptions, IState } from './types';

// utils
import { encryptPrivateKeyItemAndDelay } from './utils';

export default function useRemovePasskey(): IState {
  const _hookName = 'useAddPasskey';
  const dispatch = useDispatch<IAppThunkDispatch<IMainRootState>>();
  // selectors
  const logger = useSelectLogger();
  // states
  const [encryptionProgressState, setEncryptionProgressState] = useState<
    IEncryptionState[]
  >([]);
  const [encrypting, setEncrypting] = useState<boolean>(false);
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [requesting, setRequesting] = useState<boolean>(false);
  // actions
  const removePasskeyAction = async ({
    passkey,
    password,
  }: IRemovePasskeyActionOptions): Promise<boolean> => {
    const _functionName = 'removePasskeyAction';
    const passwordManager = new PasswordManager({
      logger,
      passwordTag: browser.runtime.id,
    });
    let inputKeyMaterial: Uint8Array;
    let isPasswordValid: boolean;
    let privateKeyItems: IPrivateKey[];
    let privateKeyRepository: PrivateKeyRepository;

    // reset the previous values
    resetAction();

    isPasswordValid = await passwordManager.verifyPassword(password);

    if (!isPasswordValid) {
      logger?.debug(`${_hookName}#${_functionName}: invalid password`);

      setError(new InvalidPasswordError());

      return false;
    }

    setRequesting(true);

    logger.debug(
      `${_hookName}#${_functionName}: requesting input key material from passkey "${passkey.id}"`
    );

    try {
      // fetch the encryption key material
      inputKeyMaterial = await PasskeyManager.fetchInputKeyMaterialFromPasskey({
        credential: passkey,
        logger,
      });
    } catch (error) {
      logger?.debug(`${_hookName}#${_functionName}:`, error);

      setRequesting(false);
      setError(error);

      return false;
    }

    setRequesting(false);
    setEncrypting(true);

    privateKeyRepository = new PrivateKeyRepository();
    privateKeyItems = await privateKeyRepository.fetchAll();

    // set the encryption state for each item to false
    setEncryptionProgressState(
      privateKeyItems.map(({ id }) => ({
        id,
        encrypted: false,
      }))
    );

    // re-encrypt each private key items with the password
    try {
      privateKeyItems = await Promise.all(
        privateKeyItems.map(async (privateKeyItem, index) => {
          const item = await encryptPrivateKeyItemAndDelay({
            delay: (index + 1) * 300, // add a staggered delay for the ui to catch up
            inputKeyMaterial,
            logger,
            passkey,
            password,
            privateKeyItem,
          });

          // update the encryption state
          setEncryptionProgressState((_encryptionProgressState) =>
            _encryptionProgressState.map((value) =>
              value.id === privateKeyItem.id
                ? {
                    ...value,
                    encrypted: true,
                  }
                : value
            )
          );

          return item;
        })
      );
    } catch (error) {
      logger?.debug(`${_hookName}#${_functionName}:`, error);

      setEncrypting(false);
      setError(error);

      return error;
    }

    // save the new encrypted items to storage
    await privateKeyRepository.saveMany(privateKeyItems);

    // remove the passkey to storage
    await dispatch(removePasskeyToStorageThunk()).unwrap();

    logger?.debug(
      `${_hookName}#${_functionName}: successfully removed passkey`
    );

    setEncrypting(false);

    return true;
  };
  const resetAction = () => {
    setEncryptionProgressState([]);
    setEncrypting(false);
    setError(null);
    setRequesting(false);
  };

  return {
    encryptionProgressState,
    encrypting,
    error,
    removePasskeyAction,
    requesting,
    resetAction,
  };
}

import { encode as encodeUTF8 } from '@stablelib/utf8';
import { useState } from 'react';
import browser from 'webextension-polyfill';

// errors
import {
  BaseExtensionError,
  InvalidPasswordError,
  MalformedDataError,
} from '@extension/errors';

// managers
import PasswordManager from '@extension/managers/PasswordManager';

// selectors
import {
  useSelectLogger,
  useSelectPasskeysEnabled,
} from '@extension/selectors';

// repositories
import PasswordTagRepository from '@extension/repositories/PasswordTagRepository';
import PrivateKeyRepository from '@extension/repositories/PrivateKeyRepository';

// types
import type { IEncryptionState } from '@extension/components/ReEncryptKeysLoadingContent';
import type { IPasswordTag, IPrivateKey } from '@extension/types';
import type { IChangePasswordActionOptions, IState } from './types';

// utils
import { encryptPrivateKeyItemWithDelay } from './utils';

export default function useChangePassword(): IState {
  const _hookName = 'useChangePassword';
  // selectors
  const logger = useSelectLogger();
  const passkeyEnabled = useSelectPasskeysEnabled();
  // states
  const [encryptionProgressState, setEncryptionProgressState] = useState<
    IEncryptionState[]
  >([]);
  const [encrypting, setEncrypting] = useState<boolean>(false);
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [passwordTag, setPasswordTag] = useState<IPasswordTag | null>(null);
  const [validating, setValidating] = useState<boolean>(false);
  // actions
  const changePasswordAction = async ({
    currentPassword,
    newPassword,
  }: IChangePasswordActionOptions): Promise<boolean> => {
    const _functionName = 'changePasswordAction';
    const passwordTagRepository = new PasswordTagRepository();
    const passwordManager = new PasswordManager({
      logger,
      passwordTag: browser.runtime.id,
      passwordTagRepository,
    });
    let _error: string;
    let isPasswordValid: boolean;
    let passwordTag = await passwordTagRepository.fetch();
    let privateKeyItems: IPrivateKey[];
    let privateKeyRepository: PrivateKeyRepository;

    // reset the previous values
    resetAction();

    setValidating(true);

    // if there is no password tag
    if (!passwordTag) {
      _error = `attempted to change password, but no previous password tag found`;

      logger.debug(`${_hookName}#${_functionName}: ${_error}`);

      setValidating(false);
      setError(new MalformedDataError(_error));

      return false;
    }

    if (currentPassword === newPassword) {
      logger.debug(
        `${_hookName}#${_functionName}: passwords match, ignoring update`
      );

      setPasswordTag(passwordTag);

      return true;
    }

    isPasswordValid = await passwordManager.verifyPassword(currentPassword);

    if (!isPasswordValid) {
      logger?.debug(`${_hookName}#${_functionName}: invalid password`);

      setValidating(false);
      setError(new InvalidPasswordError());

      return false;
    }

    setValidating(false);
    setEncrypting(true);

    // re-encrypt the password tag with the new password
    try {
      passwordTag = {
        ...passwordTag,
        encryptedTag: PasswordTagRepository.encode(
          await PasswordManager.encryptBytes({
            bytes: encodeUTF8(passwordManager.getPasswordTag()),
            logger,
            password: newPassword,
          })
        ),
      };
    } catch (error) {
      setEncrypting(false);
      setError(error);

      return false;
    }

    logger?.debug(
      `${_hookName}#${_functionName}: re-encrypted password tag "${passwordTag.id}"`
    );

    // only re-encrypt the keys if the passkey is not enabled
    if (!passkeyEnabled) {
      logger?.debug(
        `${_hookName}#${_functionName}: re-encrypting private keys`
      );

      privateKeyRepository = new PrivateKeyRepository();
      privateKeyItems = await privateKeyRepository.fetchAll();

      // set the encryption state for each item to false
      setEncryptionProgressState(
        privateKeyItems.map(({ id }) => ({
          id,
          encrypted: false,
        }))
      );

      // re-encrypt each private key items
      try {
        privateKeyItems = await Promise.all(
          privateKeyItems.map(async (privateKeyItem, index) => {
            const item = await encryptPrivateKeyItemWithDelay({
              currentPassword,
              delay: (index + 1) * 300, // add a staggered delay for the ui to catch up
              logger,
              newPassword,
              privateKeyItem,
            });

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
        setEncrypting(false);
        setError(error);

        return false;
      }

      // save the new encrypted items to storage
      await privateKeyRepository.saveMany(privateKeyItems);

      logger?.debug(`${_hookName}#${_functionName}: re-encrypted private keys`);
    }

    // save the new password tag to storage
    passwordTag = await passwordTagRepository.save(passwordTag);

    logger?.debug(
      `${_hookName}#${_functionName}: successfully changed password`
    );

    setPasswordTag(passwordTag);
    setEncrypting(false);

    return true;
  };
  const resetAction = () => {
    setEncryptionProgressState([]);
    setEncrypting(false);
    setError(null);
    setPasswordTag(null);
    setValidating(false);
  };

  return {
    changePasswordAction,
    encryptionProgressState,
    encrypting,
    error,
    passwordTag,
    resetAction,
    validating,
  };
}

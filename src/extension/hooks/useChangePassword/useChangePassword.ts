import { encode as encodeUTF8 } from '@stablelib/utf8';
import { useState } from 'react';
import browser from 'webextension-polyfill';

// errors
import {
  BaseExtensionError,
  InvalidPasswordError,
  MalformedDataError,
} from '@extension/errors';

// selectors
import { useSelectLogger } from '@extension/selectors';

// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IEncryptionState } from '@extension/components/ReEncryptKeysLoadingContent';
import type { IPasswordTag, IPrivateKey } from '@extension/types';
import { IChangePasswordActionOptions, IUseChangePasswordState } from './types';

// utils
import { reEncryptPrivateKeyItemWithDelay } from './utils';

export default function useChangePassword(): IUseChangePasswordState {
  const _hookName = 'useChangePassword';
  // selectors
  const logger = useSelectLogger();
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
  }: IChangePasswordActionOptions) => {
    const _functionName = 'changePasswordAction';
    const passwordService = new PasswordService({
      logger,
      passwordTag: browser.runtime.id,
    });
    let _error: string;
    let isPasswordValid: boolean;
    let passwordTag = await passwordService.fetchFromStorage();
    let privateKeyItems: IPrivateKey[];
    let privateKeyService: PrivateKeyService;

    // reset the previous values
    resetAction();

    setValidating(true);

    // if there is no password tag
    if (!passwordTag) {
      _error = `attempted to change password, but no previous password tag found`;

      logger.debug(`${_hookName}#${_functionName}: ${_error}`);

      setValidating(false);

      return setError(new MalformedDataError(_error));
    }

    if (currentPassword === newPassword) {
      logger.debug(
        `${_hookName}#${_functionName}: passwords match, ignoring update`
      );

      return setPasswordTag(passwordTag);
    }

    isPasswordValid = await passwordService.verifyPassword(currentPassword);

    if (!isPasswordValid) {
      logger?.debug(`${_hookName}#${_functionName}: invalid password`);

      setValidating(false);

      return setError(new InvalidPasswordError());
    }

    setValidating(false);
    setEncrypting(true);

    // re-encrypt the password tag with the new password
    try {
      passwordTag = {
        ...passwordTag,
        encryptedTag: PasswordService.encode(
          await PasswordService.encryptBytes({
            data: encodeUTF8(passwordService.getPasswordTag()),
            logger,
            password: newPassword,
          })
        ),
      };
    } catch (error) {
      setEncrypting(false);

      return setError(error);
    }

    logger?.debug(
      `${_hookName}#${_functionName}: re-encrypted password tag "${passwordTag.id}"`
    );

    privateKeyService = new PrivateKeyService({
      logger,
    });
    privateKeyItems = await privateKeyService.fetchAllFromStorage();

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
          const item = await reEncryptPrivateKeyItemWithDelay({
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

      return setError(error);
    }

    // save the new encrypted items to storage
    await privateKeyService.saveManyToStorage(privateKeyItems);

    // save the new password tag to storage
    passwordTag = await passwordService.saveToStorage(passwordTag);

    logger?.debug(
      `${_hookName}#${_functionName}: successfully changed password`
    );

    setPasswordTag(passwordTag);
    setEncrypting(false);
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

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
import { useSelectAccounts, useSelectLogger } from '@extension/selectors';

// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type { IPasswordTag, IPrivateKey } from '@extension/types';
import type {
  IChangePasswordActionOptions,
  IUseChangePasswordState,
} from './types';

export default function useChangePassword(): IUseChangePasswordState {
  const _hookName = 'useChangePassword';
  // selectors
  const accounts = useSelectAccounts();
  const logger = useSelectLogger();
  // states
  const [count, setCount] = useState<number>(0);
  const [encrypting, setEncrypting] = useState<boolean>(false);
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [passwordTag, setPasswordTag] = useState<IPasswordTag | null>(null);
  const [total, setTotal] = useState<number>(accounts.length);
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

    setTotal(privateKeyItems.length);

    // re-encrypt each private key items
    try {
      privateKeyItems = await Promise.all(
        privateKeyItems.map(async (value) => {
          const decryptedPrivateKey = await PasswordService.decryptBytes({
            data: PrivateKeyService.decode(value.encryptedPrivateKey),
            logger,
            password: currentPassword,
          }); // decrypt the private key with the current password
          const reEncryptedPrivateKey = await PasswordService.encryptBytes({
            data: decryptedPrivateKey,
            logger,
            password: newPassword,
          }); // re-encrypt the private key with the new password
          const item: IPrivateKey = {
            ...value,
            encryptedPrivateKey: PrivateKeyService.encode(
              reEncryptedPrivateKey
            ),
            updatedAt: new Date().getTime(),
          };

          setCount(count + 1);

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
    setCount(0);
    setEncrypting(false);
    setError(null);
    setPasswordTag(null);
    setValidating(false);
    setTotal(accounts.length);
  };

  return {
    changePasswordAction,
    encrypting,
    error,
    count,
    passwordTag,
    resetAction,
    validating,
    total,
  };
}

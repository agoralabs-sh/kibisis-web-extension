import { useState } from 'react';
import browser from 'webextension-polyfill';

// errors
import { BaseExtensionError } from '@extension/errors';

// selectors
import { useSelectLogger } from '@extension/selectors';

// servcies
import { PrivateKeyService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IPasswordTag } from '@extension/types';
import { IUseChangePasswordState } from './types';

export default function useChangePassword(): IUseChangePasswordState {
  const logger: ILogger = useSelectLogger();
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [passwordTag, setPasswordTag] = useState<IPasswordTag | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const changePassword: (
    newPassword: string,
    currentPassword: string
  ) => Promise<void> = async (newPassword: string, currentPassword: string) => {
    let newPasswordTag: IPasswordTag;
    let privateKeyService: PrivateKeyService;

    try {
      setSaving(true);

      privateKeyService = new PrivateKeyService({
        logger,
        passwordTag: browser.runtime.id,
      });

      newPasswordTag = await privateKeyService.setPassword(
        newPassword,
        currentPassword
      );

      setError(null);
      setPasswordTag(newPasswordTag);
    } catch (error) {
      setError(error);
    }

    setSaving(false);
  };

  return {
    changePassword,
    error,
    passwordTag,
    saving,
  };
}

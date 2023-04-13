import { useState } from 'react';
import browser from 'webextension-polyfill';

// Errors
import { BaseExtensionError } from '@extension/errors';

// Selectors
import { useSelectLogger } from '@extension/selectors';

// Services
import { PrivateKeyService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IPksPasswordTagStorageItem } from '@extension/types';
import { IUseChangePasswordState } from './types';

export default function useChangePassword(): IUseChangePasswordState {
  const logger: ILogger = useSelectLogger();
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [passwordTag, setPasswordTag] =
    useState<IPksPasswordTagStorageItem | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const changePassword: (
    newPassword: string,
    currentPassword: string
  ) => Promise<void> = async (newPassword: string, currentPassword: string) => {
    let newPasswordTag: IPksPasswordTagStorageItem;
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

import { useState } from 'react';
import browser from 'webextension-polyfill';

// Selectors
import { useSelectLogger } from '@extension/selectors';

// Services
import { PrivateKeyService } from '@extension/services';

// Types
import { ILogger } from '@common/types';
import { IUseChangePasswordState } from './types';

export default function useChangePassword(): IUseChangePasswordState {
  const logger: ILogger = useSelectLogger();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const changePassword: (
    newPassword: string,
    currentPassword: string
  ) => Promise<void> = async (newPassword: string, currentPassword: string) => {
    let privateKeyService: PrivateKeyService;

    try {
      setSaving(true);

      privateKeyService = new PrivateKeyService({
        logger,
        passwordTag: browser.runtime.id,
      });

      await privateKeyService.setPassword(newPassword, currentPassword);

      setError(null);
    } catch (error) {
      console.log('error: ', error);
    }

    setSaving(false);
  };

  return {
    changePassword,
    error,
    saving,
  };
}

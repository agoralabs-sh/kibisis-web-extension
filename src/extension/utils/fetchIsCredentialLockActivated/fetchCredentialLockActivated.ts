// enums
import { CredentialLockActivationStateEnum } from '@extension/enums';

// services
import CredentialLockService from '@extension/services/CredentialLockService';
import SettingsService from '@extension/services/SettingsService';

// types
import type { IBaseOptions } from '@common/types';

export default async function fetchCredentialLockActivated({
  logger,
}: IBaseOptions): Promise<CredentialLockActivationStateEnum | null> {
  const settingsService = new SettingsService({
    logger,
  });
  const credentialLockService = new CredentialLockService({
    logger,
  });
  const { security } = await settingsService.getAll();
  const alarm = await credentialLockService.getAlarm();

  if (!security.enableCredentialLock) {
    return null;
  }

  // if there is no alarm and the duration is not set to 0 ("never"), the lock is active
  return !alarm && security.credentialLockTimeoutDuration > 0
    ? CredentialLockActivationStateEnum.Active
    : CredentialLockActivationStateEnum.Inactive;
}

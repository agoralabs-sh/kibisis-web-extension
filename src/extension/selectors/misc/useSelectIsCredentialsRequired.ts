import { useSelector } from 'react-redux';

// types
import type { IBackgroundRootState, IMainRootState } from '@extension/types';

/**
 * The credentials are considered not required if:
 * * the credentials lock is enabled and the duration of the timeout is set to 0 ("never"), or
 * * the credentials lock is enabled, has a duration greater than 0 ("never") and the credentials lock is not "active"
 * @returns {boolean} true if the credentials are required, false otherwise.
 */
export default function useSelectIsCredentialsRequired(): boolean {
  return useSelector<IBackgroundRootState | IMainRootState, boolean>(
    ({ credentialLock, settings }) => {
      if (settings.security.enableCredentialLock) {
        if (
          settings.security.credentialLockTimeoutDuration <= 0 ||
          !credentialLock.active
        ) {
          return false;
        }
      }

      return true;
    }
  );
}

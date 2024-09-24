import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectSettingsCredentialLockEnabled(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.settings.security.enableCredentialLock
  );
}

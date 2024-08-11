import { useSelector } from 'react-redux';
import { ColorMode } from '@chakra-ui/react';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectSettingsCredentialLockEnabled(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.settings.security.enableCredentialLock
  );
}

import { useSelector } from 'react-redux';

// types
import type {
  IBackgroundRootState,
  IMainRootState,
  TEncryptionCredentials,
} from '@extension/types';

export default function useSelectPasswordLockCredentials(): TEncryptionCredentials | null {
  return useSelector<
    IBackgroundRootState | IMainRootState,
    TEncryptionCredentials | null
  >((state) => state.passwordLock.credentials);
}

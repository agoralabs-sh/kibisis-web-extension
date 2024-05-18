import { useSelector } from 'react-redux';

// types
import type { IBackgroundRootState, IMainRootState } from '@extension/types';

export default function useSelectPasswordLockPassword(): string | null {
  return useSelector<IBackgroundRootState | IMainRootState, string | null>(
    (state) => state.passwordLock.password
  );
}

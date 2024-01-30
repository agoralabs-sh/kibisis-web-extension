import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';
export default function useSelectPasswordLockPassword(): string | null {
  return useSelector<IMainRootState, string | null>(
    (state) => state.passwordLock.password
  );
}

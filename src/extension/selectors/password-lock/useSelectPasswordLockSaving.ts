import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';
export default function useSelectPasswordLockSaving(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.passwordLock.saving
  );
}

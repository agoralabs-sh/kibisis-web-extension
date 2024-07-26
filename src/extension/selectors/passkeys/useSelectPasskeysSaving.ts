import { useSelector } from 'react-redux';

// types
import type { IBackgroundRootState, IMainRootState } from '@extension/types';

export default function useSelectPasskeysSaving(): boolean {
  return useSelector<IBackgroundRootState | IMainRootState, boolean>(
    (state) => state.passkeys.saving
  );
}

import { useSelector } from 'react-redux';

// types
import type { IBackgroundRootState, IMainRootState } from '@extension/types';

export default function useSelectPasskeysEnabled(): boolean {
  return useSelector<IBackgroundRootState | IMainRootState, boolean>(
    (state) => !!state.passkeys.passkey
  );
}

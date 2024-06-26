import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectDebugLogging(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.settings.advanced.debugLogging
  );
}

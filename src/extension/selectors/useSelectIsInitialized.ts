import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '@extension/types';

export default function useSelectIsInitialized(): boolean | null {
  return useSelector<IMainRootState, boolean | null>(
    (state) => state.application.isInitialized
  );
}

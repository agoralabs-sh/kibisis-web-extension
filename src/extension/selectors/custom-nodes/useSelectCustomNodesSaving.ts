import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectCustomNodesSaving(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.customNodes.saving
  );
}

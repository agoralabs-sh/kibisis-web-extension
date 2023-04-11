import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '@extension/types';
export default function useSelectSavingSettings(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.settings.saving);
}

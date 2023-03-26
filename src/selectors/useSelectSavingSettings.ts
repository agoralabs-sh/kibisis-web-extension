import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '../types';
export default function useSelectSavingSettings(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.settings.saving);
}

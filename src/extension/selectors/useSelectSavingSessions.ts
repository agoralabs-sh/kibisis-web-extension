import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '@extension/types';
export default function useSelectSavingSessions(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.sessions.saving);
}

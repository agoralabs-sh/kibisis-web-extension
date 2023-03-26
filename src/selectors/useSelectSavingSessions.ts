import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '../types';
export default function useSelectSavingSessions(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.sessions.saving);
}

import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '../types';

export default function useSelectIsOnline(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.application.online
  );
}

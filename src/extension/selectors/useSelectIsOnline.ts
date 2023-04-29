import { useSelector } from 'react-redux';

// Types
import { IMainRootState } from '@extension/types';

export default function useSelectIsOnline(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.system.online);
}

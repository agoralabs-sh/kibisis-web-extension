import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectIsOnline(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.system.online);
}

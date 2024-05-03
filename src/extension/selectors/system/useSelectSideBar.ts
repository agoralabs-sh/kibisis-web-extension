import { useSelector } from 'react-redux';

// types
import type { IBaseRootState } from '@extension/types';

export default function useSelectSideBar(): boolean {
  return useSelector<IBaseRootState, boolean>((state) => state.system.sidebar);
}

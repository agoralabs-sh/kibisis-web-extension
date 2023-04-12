import { useSelector } from 'react-redux';

// Types
import { IBaseRootState } from '@extension/types';

export default function useSelectSideBar(): boolean {
  return useSelector<IBaseRootState, boolean>(
    (state) => state.application.sidebar
  );
}

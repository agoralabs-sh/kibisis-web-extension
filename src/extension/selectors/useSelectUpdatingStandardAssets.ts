import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectUpdatingStandardAssets(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.standardAssets.updating
  );
}

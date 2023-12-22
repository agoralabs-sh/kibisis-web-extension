import { useSelector } from 'react-redux';

// types
import { IMainRootState } from '@extension/types';

export default function useSelectUpdatingArc200Assets(): boolean {
  return useSelector<IMainRootState, boolean>(
    (state) => state.arc200Assets.updating
  );
}

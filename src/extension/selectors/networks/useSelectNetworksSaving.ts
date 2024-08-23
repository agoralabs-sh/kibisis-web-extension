import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectNetworksSaving(): boolean {
  return useSelector<IMainRootState, boolean>(
    ({ networks }) => networks.saving
  );
}

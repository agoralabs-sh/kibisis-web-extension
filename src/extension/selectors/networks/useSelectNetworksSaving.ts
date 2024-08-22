import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectNetworks(): boolean {
  return useSelector<IMainRootState, boolean>(
    ({ networks }) => networks.saving
  );
}

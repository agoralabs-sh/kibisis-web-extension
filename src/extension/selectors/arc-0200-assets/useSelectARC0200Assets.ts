import { useSelector } from 'react-redux';

// types
import type { IARC0200Asset, IMainRootState } from '@extension/types';

export default function useSelectARC0200Assets(): Record<
  string,
  IARC0200Asset[]
> | null {
  return useSelector<IMainRootState, Record<string, IARC0200Asset[]> | null>(
    (state) => state.arc200Assets.items
  );
}

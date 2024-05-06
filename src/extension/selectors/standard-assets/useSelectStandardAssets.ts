import { useSelector } from 'react-redux';

// types
import { IStandardAsset, IMainRootState } from '@extension/types';

export default function useSelectStandardAssets(): Record<
  string,
  IStandardAsset[]
> | null {
  return useSelector<IMainRootState, Record<string, IStandardAsset[]> | null>(
    (state) => state.standardAssets.items
  );
}

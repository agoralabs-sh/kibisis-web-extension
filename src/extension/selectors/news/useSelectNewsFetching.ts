import { useSelector } from 'react-redux';

// types
import type { IMainRootState } from '@extension/types';

export default function useSelectNewsFetching(): boolean {
  return useSelector<IMainRootState, boolean>((state) => state.news.fetching);
}

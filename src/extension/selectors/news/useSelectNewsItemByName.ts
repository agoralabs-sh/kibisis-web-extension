import { useSelector } from 'react-redux';

// types
import type { INewsItem } from '@extension/services/NewsService';
import type { IMainRootState } from '@extension/types';

/**
 * Selects the news item by name.
 * @returns {INewsItem | null} the news item or null if no item exists.
 */
export default function useSelectNewsItemByName(
  name: string
): INewsItem | null {
  return useSelector<IMainRootState, INewsItem | null>((state) => {
    return state.news.items?.find((value) => value.name === name) || null;
  });
}

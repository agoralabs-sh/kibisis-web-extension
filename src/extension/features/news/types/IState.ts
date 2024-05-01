// types
import type { INewsItem } from '@extension/services/NewsService';

/**
 * @property {boolean} fetching - true when news is being fetched from storage.
 * @property {INewsItem[] | null} items - the news items.
 * @property {boolean} saving - true when a news item is being saved to storage.
 */
interface IState {
  fetching: boolean;
  items: INewsItem[] | null;
  saving: boolean;
}

export default IState;

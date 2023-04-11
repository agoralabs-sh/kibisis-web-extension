// Types
import { ISession } from '@extension/types';

/**
 * @property {boolean} fetching - true fetching the sessions from storage.
 * @property {ISession[]} items - the session items.
 * @property {boolean} saving - true saving the sessions from storage.
 */
interface ISessionsState {
  fetching: boolean;
  items: ISession[];
  saving: boolean;
}

export default ISessionsState;

// Types
import { ISession } from '../../../types';
import IConnectRequest from './IConnectRequest';

/**
 * @property {boolean} fetching - true fetching the sessions from storage.
 * @property {ISession[]} items - the session items.
 * @property {IConnectRequest | null} request - a connection request sent from the web page.
 * @property {boolean} saving - true saving the sessions from storage.
 */
interface ISessionsState {
  fetching: boolean;
  items: ISession[];
  request: IConnectRequest | null;
  saving: boolean;
}

export default ISessionsState;

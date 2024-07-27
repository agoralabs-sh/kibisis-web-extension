// types
import { ISession } from '@extension/types';

/**
 * @property {boolean} fetching - true fetching the sessions from storage.
 * @property {boolean} saving - true saving the sessions from storage.
 * @property {boolean} walletConnectModalOpen - true if the wallet connect modal is open.
 */
interface IState {
  fetching: boolean;
  items: ISession[];
  saving: boolean;
}

export default IState;

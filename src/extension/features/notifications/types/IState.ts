// types
import { INotification } from '@extension/types';

/**
 * @property {INotification[]} items - a list of notifications.
 */
interface IState {
  items: INotification[];
}

export default IState;

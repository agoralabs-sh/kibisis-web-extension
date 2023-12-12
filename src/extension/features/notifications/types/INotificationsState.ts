// types
import { INotification } from '@extension/types';

/**
 * @property {INotification[]} items - a list of notifications.
 */
interface INotificationsState {
  items: INotification[];
}

export default INotificationsState;

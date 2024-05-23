// types
import TNotificationType from './TNotificationType';

/**
 * @property {string | null} description - A more detailed explanation of the notification.
 * @property {boolean} ephemeral - if this is true, the notification will be removed on exit and will not appear in
 * notification UI.
 * @property {string} id - a UUID v4 string to uniquely identify the notification.
 * @property {string} title - the title to display in the notification.
 * @property {boolean} showing - whether the notification is currently showing.
 * @property {boolean} shown - whether the notification has been shown.
 * @property {TNotificationType} type - the type of notification.
 */
interface INotification {
  description: string | null;
  ephemeral: boolean;
  id: string;
  title: string;
  read: boolean;
  showing: boolean;
  shown: boolean;
  type: TNotificationType;
}

export default INotification;

// types
import { INotificationType } from '@extension/types';

interface IAddNotificationPayload {
  description?: string;
  ephemeral?: boolean;
  title: string;
  type: INotificationType;
}

export default IAddNotificationPayload;

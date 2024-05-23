// types
import type { TNotificationType } from '@extension/types';

interface IAddNotificationPayload {
  description?: string;
  ephemeral?: boolean;
  title: string;
  type: TNotificationType;
}

export default IAddNotificationPayload;

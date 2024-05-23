// types
import type { TNotificationType } from '@extension/types';

interface IProps {
  description?: string;
  title: string;
  onClose: () => void;
  type?: TNotificationType;
}

export default IProps;

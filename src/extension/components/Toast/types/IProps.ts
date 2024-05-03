// types
import type { INotificationType } from '@extension/types';

interface IProps {
  description?: string;
  title: string;
  onClose: () => void;
  type?: INotificationType;
}

export default IProps;

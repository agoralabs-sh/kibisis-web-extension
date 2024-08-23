// types
import type {
  IModalProps,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IProps extends IModalProps {
  isOpen: boolean;
  onComplete?: (value: INetworkWithTransactionParams) => void;
}

export default IProps;

// types
import type { ICustomNodeItem } from '@extension/services/CustomNodesService';
import type { IModalProps } from '@extension/types';

interface IProps extends IModalProps {
  item: ICustomNodeItem | null;
}

export default IProps;

// types
import type { ICustomNode, IModalProps } from '@extension/types';

interface IProps extends IModalProps {
  item: ICustomNode | null;
}

export default IProps;

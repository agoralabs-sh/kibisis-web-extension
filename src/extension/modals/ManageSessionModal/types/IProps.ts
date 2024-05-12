// types
import type { IModalProps, ISession } from '@extension/types';

interface IProps extends IModalProps {
  session: ISession | null;
}

export default IProps;

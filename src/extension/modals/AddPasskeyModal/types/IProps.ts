// types
import type { IModalProps, IPasskeyCredential } from '@extension/types';

interface IProps extends IModalProps {
  addPasskey: IPasskeyCredential | null;
}

export default IProps;

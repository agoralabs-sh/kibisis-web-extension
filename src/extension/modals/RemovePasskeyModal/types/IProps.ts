// types
import type { IModalProps, IPasskeyCredential } from '@extension/types';

interface IProps extends IModalProps {
  removePasskey: IPasskeyCredential | null;
}

export default IProps;

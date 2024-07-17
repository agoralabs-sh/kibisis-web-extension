// types
import type { IEncryptionState } from '@extension/components/ReEncryptKeysLoadingContent';
import type { IModalProps } from '@extension/types';

interface IProps extends IModalProps {
  encryptionProgressState: IEncryptionState[];
  isOpen: boolean;
}

export default IProps;

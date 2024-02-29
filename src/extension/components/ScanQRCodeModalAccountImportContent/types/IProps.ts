// types
import type {
  IARC0300AccountImportSchema,
  IScanQRCodeModalContentProps,
} from '@extension/types';

interface IProps extends IScanQRCodeModalContentProps {
  onComplete: () => void;
  schema: IARC0300AccountImportSchema;
}

export default IProps;

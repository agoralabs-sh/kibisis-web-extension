// types
import type { IARC0300AccountImportSchema } from '@extension/types';

interface IAccountImportModalContentProps {
  onComplete: () => void;
  onPreviousClick: () => void;
  schema: IARC0300AccountImportSchema;
}

export default IAccountImportModalContentProps;

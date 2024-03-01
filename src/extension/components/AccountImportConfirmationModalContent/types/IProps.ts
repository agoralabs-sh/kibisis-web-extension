// types
import type { IARC0300AccountImportSchema } from '@extension/types';

interface IProps {
  onComplete: () => void;
  onPreviousClick: () => void;
  schema: IARC0300AccountImportSchema;
}

export default IProps;

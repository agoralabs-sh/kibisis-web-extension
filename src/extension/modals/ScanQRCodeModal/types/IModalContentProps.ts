import type { IARC0300BaseSchema } from '@extension/types';

interface IModalContentProps<Schema extends IARC0300BaseSchema> {
  onComplete: () => void;
  onPreviousClick: () => void;
  schema: Schema;
}

export default IModalContentProps;

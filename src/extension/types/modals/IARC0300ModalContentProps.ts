import type { IARC0300BaseSchema } from '@extension/types';

interface IARC0300ModalContentProps<Schema extends IARC0300BaseSchema> {
  onComplete: () => void;
  onPreviousClick: () => void;
  schema: Schema;
}

export default IARC0300ModalContentProps;

import { ReactElement } from 'react';

// types
import type { IARC0300BaseSchema } from '@extension/types';

interface IARC0300ModalContentProps<
  Schema extends IARC0300BaseSchema | IARC0300BaseSchema[]
> {
  cancelButtonIcon?: ReactElement;
  cancelButtonLabel?: string;
  onCancel: () => void;
  onComplete: () => void;
  schemaOrSchemas: Schema;
}

export default IARC0300ModalContentProps;

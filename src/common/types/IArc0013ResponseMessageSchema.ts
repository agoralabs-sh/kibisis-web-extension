// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

// errors
import { BaseSerializableArc0013Error } from '@common/errors';

interface IArc0013ResponseMessageSchema<Result> {
  error?: BaseSerializableArc0013Error;
  id: string;
  reference: Arc0013MessageReferenceEnum;
  requestId: string;
  result?: Result;
}

export default IArc0013ResponseMessageSchema;

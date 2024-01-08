// enums
import { Arc0013MessageReferenceEnum } from '@common/enums';

interface IArc0013RequestMessageSchema<Params> {
  id: string;
  params: Params;
  reference: Arc0013MessageReferenceEnum;
}

export default IArc0013RequestMessageSchema;

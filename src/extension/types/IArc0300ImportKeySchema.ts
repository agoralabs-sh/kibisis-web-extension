// enums
import { Arc0300EncodingEnum, Arc0300MethodEnum } from '@extension/enums';

// types
import type IArc0300BaseSchema from './IArc0300BaseSchema';

interface IArc0300ImportKeySchema extends IArc0300BaseSchema {
  encodedPrivateKey: string;
  encoding: Arc0300EncodingEnum;
  method: Arc0300MethodEnum.ImportKey;
}

export default IArc0300ImportKeySchema;

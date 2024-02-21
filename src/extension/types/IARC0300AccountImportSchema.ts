// enums
import {
  ARC0300AuthorityEnum,
  ARC0300EncodingEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type IARC0300BaseSchema from './IARC0300BaseSchema';

interface IARC0300AccountImportQuery {
  [ARC0300QueryEnum.Asset]: string[];
  [ARC0300QueryEnum.Encoding]: ARC0300EncodingEnum;
  [ARC0300QueryEnum.PrivateKey]: string;
}

interface IARC0300AccountImportSchema extends IARC0300BaseSchema {
  authority: ARC0300AuthorityEnum.Account;
  paths: [ARC0300PathEnum.Import];
  query: IARC0300AccountImportQuery;
}

export default IARC0300AccountImportSchema;

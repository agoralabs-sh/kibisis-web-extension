// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// types
import type IARC0300BaseSchema from './IARC0300BaseSchema';
import type IARC0300AccountImportQuery from './IARC0300AccountImportQuery';

interface IARC0300AccountImportSchema
  extends IARC0300BaseSchema<IARC0300AccountImportQuery> {
  authority: ARC0300AuthorityEnum.Account;
  paths: [ARC0300PathEnum.Import];
}

export default IARC0300AccountImportSchema;

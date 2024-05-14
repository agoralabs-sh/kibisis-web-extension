// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// types
import type IARC0300BaseSchema from './IARC0300BaseSchema';
import type IARC0300AccountImportWithAddressQuery from './IARC0300AccountImportWithAddressQuery';
import type IARC0300AccountImportWithPrivateKeyQuery from './IARC0300AccountImportWithPrivateKeyQuery';

interface IARC0300AccountImportSchema<
  Query =
    | IARC0300AccountImportWithPrivateKeyQuery
    | IARC0300AccountImportWithAddressQuery
> extends IARC0300BaseSchema<Query> {
  authority: ARC0300AuthorityEnum.Account;
  paths: [ARC0300PathEnum.Import];
}

export default IARC0300AccountImportSchema;

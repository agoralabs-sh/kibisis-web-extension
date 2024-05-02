// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// types
import type IARC0300BaseSchema from './IARC0300BaseSchema';
import type IARC0300AssetAddQuery from './IARC0300AssetAddQuery';

interface IARC0300AssetAddSchema
  extends IARC0300BaseSchema<IARC0300AssetAddQuery> {
  authority: ARC0300AuthorityEnum.Asset;
  paths: [ARC0300PathEnum.Add, string];
}

export default IARC0300AssetAddSchema;

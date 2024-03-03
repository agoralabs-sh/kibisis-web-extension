// enums
import {
  ARC0300AssetTypeEnum,
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type IARC0300BaseSchema from './IARC0300BaseSchema';

interface IARC0300AssetAddQuery {
  [ARC0300QueryEnum.GenesisHash]: string;
  [ARC0300QueryEnum.Type]: ARC0300AssetTypeEnum;
}

interface IARC0300AssetAddSchema extends IARC0300BaseSchema {
  authority: ARC0300AuthorityEnum.Asset;
  paths: [ARC0300PathEnum.Add, string];
  query: IARC0300AssetAddQuery;
}

export default IARC0300AssetAddSchema;

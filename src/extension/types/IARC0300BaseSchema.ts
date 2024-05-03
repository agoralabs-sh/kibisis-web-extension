// constants
import { ARC_0300_SCHEME } from '@extension/constants';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

// types
import type TARC0300Queries from './TARC0300Queries';

interface IARC0300BaseSchema<Query = TARC0300Queries> {
  scheme: typeof ARC_0300_SCHEME;
  authority: ARC0300AuthorityEnum;
  paths: (ARC0300PathEnum | string)[];
  query: Query;
}

export default IARC0300BaseSchema;

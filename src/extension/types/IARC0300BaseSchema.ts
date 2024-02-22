// constants
import { ARC_0300_SCHEME } from '@extension/constants';

// enums
import { ARC0300AuthorityEnum, ARC0300PathEnum } from '@extension/enums';

interface IARC0300BaseSchema {
  scheme: typeof ARC_0300_SCHEME;
  authority: ARC0300AuthorityEnum;
  paths: (ARC0300PathEnum | string)[];
}

export default IARC0300BaseSchema;

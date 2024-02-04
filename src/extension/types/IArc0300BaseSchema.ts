// constants
import { ARC_0300_PROTOCOL } from '@extension/constants';

// enums
import { Arc0300MethodEnum } from '@extension/enums';

interface IArc0300BaseSchema {
  protocol: typeof ARC_0300_PROTOCOL;
  method: Arc0300MethodEnum;
}

export default IArc0300BaseSchema;

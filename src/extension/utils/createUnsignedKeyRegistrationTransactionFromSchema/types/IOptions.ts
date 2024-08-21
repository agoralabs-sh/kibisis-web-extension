// types
import type { IBaseOptions } from '@common/types';
import type {
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
  TCustomNodeItemOrNetwork,
} from '@extension/types';

interface IOptions extends IBaseOptions {
  customNodeOrNetwork: TCustomNodeItemOrNetwork;
  schema:
    | IARC0300OfflineKeyRegistrationTransactionSendSchema
    | IARC0300OnlineKeyRegistrationTransactionSendSchema;
}

export default IOptions;

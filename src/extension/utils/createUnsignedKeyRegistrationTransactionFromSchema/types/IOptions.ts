// types
import type { IBaseOptions } from '@common/types';
import type {
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
  INetwork,
} from '@extension/types';

interface IOptions extends IBaseOptions {
  network: INetwork;
  schema:
    | IARC0300OfflineKeyRegistrationTransactionSendSchema
    | IARC0300OnlineKeyRegistrationTransactionSendSchema;
}

export default IOptions;

// types
import type {
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
} from '@extension/types';

type TTransactionSendSchemas =
  | IARC0300OfflineKeyRegistrationTransactionSendSchema
  | IARC0300OnlineKeyRegistrationTransactionSendSchema;

export default TTransactionSendSchemas;

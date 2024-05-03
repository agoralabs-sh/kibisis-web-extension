// types
import type {
  IARC0300OfflineKeyRegistrationTransactionSendSchema,
  IARC0300OnlineKeyRegistrationTransactionSendSchema,
} from '@extension/types';

type TARC0300TransactionSendSchemas =
  | IARC0300OfflineKeyRegistrationTransactionSendSchema
  | IARC0300OnlineKeyRegistrationTransactionSendSchema;

export default TARC0300TransactionSendSchemas;

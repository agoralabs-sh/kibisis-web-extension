// types
import type IARC0300AccountImportQuery from './IARC0300AccountImportWithPrivateKeyQuery';
import type IARC0300AssetAddQuery from './IARC0300AssetAddQuery';
import type IARC0300OfflineKeyRegistrationTransactionSendQuery from './IARC0300OfflineKeyRegistrationTransactionSendQuery';
import type IARC0300OnlineKeyRegistrationTransactionSendQuery from './IARC0300OnlineKeyRegistrationTransactionSendQuery';
import type IARC0300AccountImportWithAddressQuery from './IARC0300AccountImportWithAddressQuery';

type TARC0300Queries =
  | IARC0300AccountImportQuery
  | IARC0300AssetAddQuery
  | IARC0300OfflineKeyRegistrationTransactionSendQuery
  | IARC0300OnlineKeyRegistrationTransactionSendQuery
  | IARC0300AccountImportWithAddressQuery;

export default TARC0300Queries;

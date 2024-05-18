import { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// types
import type IClientRequestEvent from './IClientRequestEvent';
import type IARC0300KeyRegistrationTransactionSendEvent from './IARC0300KeyRegistrationTransactionSendEvent';

type TEvents =
  | IARC0300KeyRegistrationTransactionSendEvent
  | IClientRequestEvent<TRequestParams>;

export default TEvents;

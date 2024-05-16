import { TRequestParams } from '@agoralabs-sh/avm-web-provider';

// types
import type IClientRequestEvent from './IClientRequestEvent';
import type ISendKeyRegistrationTransactionEvent from './ISendKeyRegistrationTransactionEvent';

type TEvents =
  | IClientRequestEvent<TRequestParams>
  | ISendKeyRegistrationTransactionEvent;

export default TEvents;

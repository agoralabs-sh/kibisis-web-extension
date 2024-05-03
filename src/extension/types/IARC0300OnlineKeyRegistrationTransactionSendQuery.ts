import { TransactionType } from 'algosdk';

// enums
import { ARC0300QueryEnum } from '@extension/enums';

// types
import type IARC0300CommonTransactionSendQuery from './IARC0300CommonTransactionSendQuery';

interface IARC0300OnlineKeyRegistrationTransactionSendQuery
  extends IARC0300CommonTransactionSendQuery {
  [ARC0300QueryEnum.SelectionKey]: string;
  [ARC0300QueryEnum.StateProofKey]: string;
  [ARC0300QueryEnum.Type]: TransactionType.keyreg;
  [ARC0300QueryEnum.VoteFirst]: string;
  [ARC0300QueryEnum.VoteKey]: string;
  [ARC0300QueryEnum.VoteKeyDilution]: string;
  [ARC0300QueryEnum.VoteLast]: string;
}

export default IARC0300OnlineKeyRegistrationTransactionSendQuery;

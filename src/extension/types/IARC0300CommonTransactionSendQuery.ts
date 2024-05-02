import { TransactionType } from 'algosdk';

// enums
import { ARC0300QueryEnum } from '@extension/enums';

interface IARC0300OnlineKeyRegistrationTransactionSendQuery {
  [ARC0300QueryEnum.Fee]?: string;
  [ARC0300QueryEnum.FirstValid]?: string;
  [ARC0300QueryEnum.GenesisHash]?: string;
  [ARC0300QueryEnum.Group]?: string;
  [ARC0300QueryEnum.LastValid]?: string;
  [ARC0300QueryEnum.Lease]?: string;
  [ARC0300QueryEnum.Note]?: string;
  [ARC0300QueryEnum.ReyKeyTo]?: string;
  [ARC0300QueryEnum.Sender]: string;
  [ARC0300QueryEnum.Type]: TransactionType;
}

export default IARC0300OnlineKeyRegistrationTransactionSendQuery;

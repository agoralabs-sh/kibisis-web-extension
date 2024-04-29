// enums
import { ConnectionTypeEnum } from '../enums';

// types
import type { INetwork } from '@extension/types';
import type IAccountInformation from './IAccountInformation';
import type TSignTransactionsAction from './TSignTransactionsAction';

interface IBaseTransactionProps {
  account: IAccountInformation | null;
  connectionType: ConnectionTypeEnum;
  network: INetwork | null;
  signTransactionsAction: TSignTransactionsAction;
}

export default IBaseTransactionProps;

// types
import type {
  IAccountWithExtendedProps,
  IDragItem,
  INetworkWithTransactionParams,
} from '@extension/types';

interface IItemProps {
  account: IAccountWithExtendedProps;
  accounts: IAccountWithExtendedProps[];
  active: boolean;
  index: number;
  network: INetworkWithTransactionParams;
  onClick: (id: string) => void;
  onSort: (dragIndex: number, hoverIndex: number) => void;
  onSortComplete: (item: IDragItem) => void;
}

export default IItemProps;

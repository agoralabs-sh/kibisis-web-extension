// types
import type { IAccount } from '@extension/types';

interface IProps {
  accounts: IAccount[];
  disabled?: boolean;
  onSelect: (account: IAccount) => void;
  value: IAccount;
  width?: string | number;
}

export default IProps;

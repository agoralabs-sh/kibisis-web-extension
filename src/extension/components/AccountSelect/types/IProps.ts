// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  disabled?: boolean;
  label?: string;
  onSelect: (account: IAccountWithExtendedProps) => void;
  required?: boolean;
  value: IAccountWithExtendedProps;
}

export default IProps;

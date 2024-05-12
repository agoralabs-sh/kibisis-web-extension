// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  disabled?: boolean;
  onSelect: (account: IAccountWithExtendedProps) => void;
  value: IAccountWithExtendedProps;
  width?: string | number;
}

export default IProps;

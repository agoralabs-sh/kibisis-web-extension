// types
import type {
  IAccountWithExtendedProps,
  IPropsWithContext,
} from '@extension/types';

interface IProps extends IPropsWithContext {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  disabled?: boolean;
  label?: string;
  onSelect: (account: IAccountWithExtendedProps) => void;
  required?: boolean;
  selectModalTitle?: string;
  value: IAccountWithExtendedProps;
}

export default IProps;

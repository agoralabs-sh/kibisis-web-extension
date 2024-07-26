// types
import type { IAccountWithExtendedProps, IModalProps } from '@extension/types';

interface IProps extends IModalProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  isOpen: boolean;
  multiple?: boolean;
  onSelect: (accounts: IAccountWithExtendedProps[]) => void;
}

export default IProps;

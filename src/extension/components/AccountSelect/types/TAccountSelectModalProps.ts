// types
import type {
  IAccountWithExtendedProps,
  IModalProps,
  IPropsWithContext,
} from '@extension/types';

interface IAccountSelectModalProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  isOpen: boolean;
  multiple?: boolean;
  onSelect: (accounts: IAccountWithExtendedProps[]) => void;
}

type TAccountSelectModalProps = IAccountSelectModalProps &
  IModalProps &
  IPropsWithContext;

export default TAccountSelectModalProps;

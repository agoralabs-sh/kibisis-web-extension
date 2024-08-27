import type { InputProps } from '@chakra-ui/react';

// types
import type {
  IAccountWithExtendedProps,
  IPropsWithContext,
} from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  error?: string | null;
  id?: string;
  label?: string;
  onSelect?: (value: string) => void;
  required?: boolean;
  selectButtonLabel?: string;
  selectModalTitle?: string;
  validate?: (value: string) => string | null;
}
type TProps = IProps & IPropsWithContext & Omit<InputProps, 'onSelect'>;

export default TProps;

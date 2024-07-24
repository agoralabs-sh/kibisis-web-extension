import type { FocusEvent } from 'react';

// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  disabled?: boolean;
  label?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  onError?: (error: string | null) => void;
  value: string;
}

export default IProps;

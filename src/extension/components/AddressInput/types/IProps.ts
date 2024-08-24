import type { FocusEvent } from 'react';

// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  allowWatchAccounts?: boolean;
  disabled?: boolean;
  error?: string | null;
  id?: string;
  label?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  onError?: (error: string | null) => void;
  required?: boolean;
  validate?: (value: string) => string | null;
  value: string;
}

export default IProps;

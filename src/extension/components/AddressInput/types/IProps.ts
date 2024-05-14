import type { FocusEvent } from 'react';

// types
import type { IAccountWithExtendedProps } from '@extension/types';

interface IProps {
  accounts: IAccountWithExtendedProps[];
  disabled?: boolean;
  error: string | null;
  label?: string;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  value: string;
}

export default IProps;

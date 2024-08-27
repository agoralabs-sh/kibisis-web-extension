import type { FocusEvent } from 'react';

// types
import type { IOnEventOptions } from '@extension/components/AmountInput';

interface IState {
  label?: string;
  onBlur: (
    options: IOnEventOptions
  ) => (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (valueAsString: string, valueAsNumber: number) => void;
  onFocus: (event: FocusEvent<HTMLInputElement>) => void;
  onMaximumAmountClick: (options: IOnEventOptions) => void;
  required?: boolean;
  reset: () => void;
  setValue: (value: string) => void;
  value: string;
}

export default IState;

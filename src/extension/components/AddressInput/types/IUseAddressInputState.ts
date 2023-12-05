import { ChangeEvent, FocusEvent } from 'react';

interface IUseAddressInputState {
  error: string | null;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
  setError: (value: string | null) => void;
  validate: () => string | null;
  value: string;
}

export default IUseAddressInputState;

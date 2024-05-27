import type { FocusEvent } from 'react';

interface IUseAddressInputState {
  error: string | null;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  reset: () => void;
  setError: (value: string | null) => void;
  validate: () => string | null;
  value: string;
}

export default IUseAddressInputState;

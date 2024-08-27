import type { ChangeEvent, FocusEvent } from 'react';

interface IState {
  error: string | null;
  label: string;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSelect: (value: string) => void;
  required?: boolean;
  reset: () => void;
  setError: (value: string | null) => void;
  setValue: (value: string) => void;
  validate: (value: string) => string | null;
  value: string;
}

export default IState;

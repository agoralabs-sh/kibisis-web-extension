import type { ChangeEvent, FocusEvent } from 'react';

// types
import type IValidateOptions from './IValidateOptions';

interface IState {
  error: string | null;
  label: string;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  reset: () => void;
  score: number;
  setError: (value: string | null) => void;
  setScore: (value: number) => void;
  setValue: (value: string) => void;
  validate: (options: IValidateOptions) => string | null;
  value: string;
}

export default IState;

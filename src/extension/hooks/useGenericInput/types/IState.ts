import type { ChangeEvent, FocusEvent } from 'react';

interface IState<InputElement extends HTMLInputElement | HTMLTextAreaElement> {
  charactersRemaining?: number;
  error: string | null;
  label: string;
  onBlur: (event: FocusEvent<InputElement>) => void;
  onChange: (event: ChangeEvent<InputElement>) => void;
  required?: boolean;
  reset: () => void;
  setCharactersRemaining: (value: number) => void;
  setError: (value: string | null) => void;
  setValue: (value: string) => void;
  validate: (value: string) => string | null;
  value: string;
}

export default IState;

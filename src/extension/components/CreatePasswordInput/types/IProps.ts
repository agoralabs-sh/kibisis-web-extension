import type { KeyboardEvent, MutableRefObject } from 'react';

interface IProps {
  disabled?: boolean;
  id?: string;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  label?: string;
  onChange: (value: string, score: number) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  score: number;
  value: string;
}

export default IProps;

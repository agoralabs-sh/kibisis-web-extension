import type { ChangeEvent, KeyboardEvent, MutableRefObject } from 'react';

interface IProps {
  disabled?: boolean;
  error: string | null;
  hint: string | null;
  inputRef?: MutableRefObject<HTMLInputElement | null>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
  value: string;
}

export default IProps;

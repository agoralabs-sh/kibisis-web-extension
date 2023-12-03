import { ChangeEvent } from 'react';

interface IUsePasswordState {
  error: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  password: string;
  reset: () => void;
}

export default IUsePasswordState;

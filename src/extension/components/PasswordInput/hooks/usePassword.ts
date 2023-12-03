import { ChangeEvent, useState } from 'react';

// types
import { IUsePasswordState } from '../types';

export default function usePassword(): IUsePasswordState {
  // state
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  // actions
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPassword(event.target.value);
  };
  const reset = () => {
    setError(null);
    setPassword('');
  };

  return {
    error,
    onChange,
    password,
    reset,
  };
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// types
import type { IState } from './types';

export default function useGenericInput(): IState {
  const { t } = useTranslation();
  // state
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  // actions
  const reset = () => {
    setError(null);
    setValue('');
  };

  return {
    error,
    reset,
    setError,
    setValue,
    value,
  };
}

import { ChangeEvent, FocusEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

// types
import { IUsePasswordState } from '../types';

// utils
import { validate as validatePassword } from '../utils';

export default function usePassword(): IUsePasswordState {
  const { t } = useTranslation();
  // state
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  // actions
  const onBlur = (event: FocusEvent<HTMLInputElement>) =>
    setError(validatePassword(event.target.value, t));
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setValue(event.target.value);
  };
  const reset = () => {
    setError(null);
    setValue('');
  };
  const validate: () => string | null = () => {
    const newError: string | null = validatePassword(value, t);

    setError(newError);

    return newError;
  };

  return {
    error,
    onBlur,
    onChange,
    reset,
    setError,
    validate,
    value,
  };
}

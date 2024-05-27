import { FocusEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

// types
import { IUseAddressInputState } from '../types';

// utils
import { validate as validateAddress } from '../utils';

export default function useAddressInput(): IUseAddressInputState {
  const { t } = useTranslation();
  // state
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  // actions
  const onBlur = (event: FocusEvent<HTMLInputElement>) =>
    setError(validateAddress(event.target.value, t));
  const onChange = (value: string) => {
    setError(null);
    setValue(value);
  };
  const reset: () => void = () => {
    setError(null);
    setValue('');
  };
  const validate: () => string | null = () => {
    const newError: string | null = validateAddress(value, t);

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

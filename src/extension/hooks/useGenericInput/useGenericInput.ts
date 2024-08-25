import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// types
import type { IOptions, IState } from './types';

// utils
import validateInput from '@extension/utils/validateInput';

export default function useGenericInput({
  characterLimit,
  defaultValue,
  label,
  required,
  validate,
}: IOptions): IState {
  const { t } = useTranslation();
  // state
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>(defaultValue || '');
  // actions
  const reset = () => {
    setError(null);
    setValue(defaultValue || '');
  };
  const _validate = (_value: string) => {
    const _error = validateInput({
      characterLimit,
      field: label,
      t,
      required,
      value: _value,
      validate,
    });

    setError(_error);

    return _error;
  };

  return {
    characterLimit,
    error,
    label,
    reset,
    required,
    setError,
    setValue,
    validate: _validate,
    value,
  };
}

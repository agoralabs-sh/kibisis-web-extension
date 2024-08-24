import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// types
import type { IOptions, IState } from './types';

// utils
import validateInput from '@extension/utils/validateInput';

export default function useGenericInput({
  characterLimit,
  label,
  required,
  validate,
}: IOptions): IState {
  const { t } = useTranslation();
  // state
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  // actions
  const reset = () => {
    setError(null);
    setValue('');
  };
  const _validate = () =>
    validateInput({
      characterLimit,
      field: label,
      t,
      required,
      value,
      validate,
    });

  return {
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

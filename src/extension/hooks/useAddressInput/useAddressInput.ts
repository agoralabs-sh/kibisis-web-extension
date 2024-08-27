import { type ChangeEvent, type FocusEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

// types
import type { IOptions, IState } from './types';

// utils
import validateAddressInput from '@extension/utils/validateAddressInput';

export default function useAddressInput({
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
  const _onBlur = (event: FocusEvent<HTMLInputElement>) => {
    setError(_validate(event.target.value));
  };
  const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(_validate(event.target.value));
    setValue(event.target.value);
  };
  const _onSelect = (_value: string) => {
    setError(_validate(_value));
    setValue(_value);
  };
  const _validate = (_value: string) => {
    const _error = validateAddressInput({
      field: label,
      t,
      required,
      value: _value,
      validate,
    });

    setError(_error);

    return _error;
  };
  const reset = () => {
    setError(null);
    setValue(defaultValue || '');
  };

  return {
    error,
    label,
    onBlur: _onBlur,
    onChange: _onChange,
    onSelect: _onSelect,
    reset,
    required,
    setError,
    setValue,
    validate: _validate,
    value,
  };
}

import { type ChangeEvent, type FocusEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import zxcvbn from 'zxcvbn';

// types
import type { IOptions, IState, IValidateOptions } from './types';

// utils
import validateNewPasswordInput from '@extension/utils/validateNewPasswordInput';

export default function useNewPasswordInput({
  label,
  required,
}: IOptions): IState {
  const { t } = useTranslation();
  // state
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(-1);
  const [value, setValue] = useState<string>('');
  // actions
  const _onBlur = (event: FocusEvent<HTMLInputElement>) => {
    // validate
    setError(
      _validate({
        score:
          event.target.value.length <= 0
            ? -1
            : zxcvbn(event.target.value).score,
        value: event.target.value,
      })
    );
  };
  const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
    // validate
    setError(
      _validate({
        score:
          event.target.value.length <= 0
            ? -1
            : zxcvbn(event.target.value).score,
        value: event.target.value,
      })
    );
    setValue(event.target.value);
  };
  const _validate = ({ score: _score, value: _value }: IValidateOptions) => {
    const _error = validateNewPasswordInput({
      field: label,
      t,
      required,
      score: _score,
      value: _value,
    });

    setError(_error);

    return _error;
  };
  const reset = () => {
    setError(null);
    setScore(-1);
    setValue('');
  };

  return {
    error,
    label,
    onBlur: _onBlur,
    onChange: _onChange,
    reset,
    required,
    score,
    setError,
    setScore,
    setValue,
    validate: _validate,
    value,
  };
}

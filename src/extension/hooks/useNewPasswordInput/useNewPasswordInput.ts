import { type ChangeEvent, type FocusEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

// types
import type { IOptions, IState, IValidateOptions } from './types';

// utils
import validateNewPasswordInput from '@extension/utils/validateNewPasswordInput';
import calculateScore from './utils/calculateScore';

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
    const _score = calculateScore(event.target.value);

    // validate
    setError(
      _validate({
        score: _score,
        value: event.target.value,
      })
    );
    setScore(_score);
  };
  const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const _score = calculateScore(event.target.value);

    // validate
    setError(
      _validate({
        score: _score,
        value: event.target.value,
      })
    );
    setScore(_score);
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

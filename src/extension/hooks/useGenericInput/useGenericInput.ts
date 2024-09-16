import { type ChangeEvent, type FocusEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// types
import type { IOptions, IState } from './types';

// utils
import validateGenericInput from '@extension/utils/validateGenericInput';

export default function useGenericInput<
  InputElement extends HTMLInputElement | HTMLTextAreaElement
>({
  characterLimit,
  defaultValue,
  label,
  required,
  validate,
}: IOptions): IState<InputElement> {
  const { t } = useTranslation();
  // state
  const [charactersRemaining, setCharactersRemaining] = useState<number | null>(
    characterLimit || null
  );
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>(defaultValue || '');
  // actions
  const _onBlur = (event: FocusEvent<InputElement>) => {
    setError(_validate(event.target.value));
  };
  const _onChange = (event: ChangeEvent<InputElement>) => {
    let byteLength: number;

    // update the characters remaining
    if (characterLimit) {
      byteLength = new TextEncoder().encode(event.target.value).byteLength;

      setCharactersRemaining(characterLimit - byteLength);
    }

    setError(_validate(event.target.value));
    setValue(event.target.value);
  };
  const _validate = (_value: string) => {
    const _error = validateGenericInput({
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
  const reset = () => {
    setCharactersRemaining(characterLimit || null);
    setError(null);
    setValue('');
  };

  return {
    error,
    label,
    onBlur: _onBlur,
    onChange: _onChange,
    reset,
    required,
    setCharactersRemaining,
    setError,
    setValue,
    validate: _validate,
    value,
    ...(charactersRemaining && {
      charactersRemaining,
    }),
  };
}

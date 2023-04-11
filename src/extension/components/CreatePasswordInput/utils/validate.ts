import { TFunction } from 'i18next';

// Constants
import { PASSWORD_MIN_LENGTH, PASSWORD_MIN_SCORE } from '@extension/constants';

export default function validate(
  value: string,
  score: number,
  t: TFunction
): string | null {
  if (value.length <= 0) {
    return t<string>('errors.inputs.required', { name: 'Password' });
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return t<string>('errors.inputs.passwordMinLength');
  }

  if (score < PASSWORD_MIN_SCORE) {
    return t<string>('errors.inputs.passwordTooWeak');
  }

  return null;
}

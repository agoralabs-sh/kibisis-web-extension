import { TFunction } from 'i18next';

// Constants
import { PASSWORD_MIN_LENGTH, PASSWORD_MIN_SCORE } from '@extension/constants';

/**
 * Validates the password and the score. The password is valid if null is returned, otherwise the string will contain
 * a human-readable error.
 * @param {string} password - the password.
 * @param {number} score - the password score.
 * @param {TFunction} t - translate function from i18next.
 * @returns {string | null} null if the password is valid, or if it is invalid, a string detailing a human-readable
 * error.
 */
export default function validate(
  password: string,
  score: number,
  t: TFunction
): string | null {
  if (password.length <= 0) {
    return t<string>('errors.inputs.required', { name: 'Password' });
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return t<string>('errors.inputs.passwordMinLength');
  }

  if (score < PASSWORD_MIN_SCORE) {
    return t<string>('errors.inputs.passwordTooWeak');
  }

  return null;
}

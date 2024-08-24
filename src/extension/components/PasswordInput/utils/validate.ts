import { TFunction } from 'i18next';

/**
 * Validates the password. The password is valid if null is returned, otherwise the string will contain a human-readable
 * error.
 * @param {string} input - the input password.
 * @param {TFunction} t - translate function from i18next.
 * @returns {string | null} null if the password is valid, or if it is invalid, a string detailing a human-readable
 * error.
 */
export default function validate(input: string, t: TFunction): string | null {
  if (input.length <= 0) {
    return t<string>('errors.inputs.requiredWithLabel', { name: 'Password' });
  }

  return null;
}

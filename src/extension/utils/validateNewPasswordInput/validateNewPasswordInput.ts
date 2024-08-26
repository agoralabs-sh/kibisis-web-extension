// constants
import { PASSWORD_MIN_LENGTH, PASSWORD_MIN_SCORE } from '@extension/constants';

// types
import type { IOptions } from './types';

/**
 * Convenience function that validates whether a new password input is valid.
 * @param {IOptions} options - the field name, a translation function, the current password score and the value.
 * @returns {string | null} the human-readable error or null if the value passed validation.
 */
export default function validateNewPasswordInput({
  field,
  required = false,
  t,
  score,
  value,
}: IOptions): string | null {
  if (value.length <= 0 && required) {
    return field
      ? t<string>('errors.inputs.requiredWithLabel', { name: field })
      : t<string>('errors.inputs.required');
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return t<string>('errors.inputs.passwordMinLength');
  }

  if (score < PASSWORD_MIN_SCORE) {
    return t<string>('errors.inputs.passwordTooWeak');
  }

  return null;
}

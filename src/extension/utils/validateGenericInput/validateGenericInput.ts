// types
import type { IOptions } from './types';

/**
 * Convenience function that validates whether an input is valid.
 * @param {IOptions} options - the field name, a translation function, a custom validation function and the value.
 * @returns {string | null} the human-readable error or null if the value passed validation.
 */
export default function validateGenericInput({
  characterLimit,
  field,
  required = false,
  t,
  validate,
  value,
}: IOptions): string | null {
  let byteLength: number;

  if (value.length <= 0 && required) {
    return field
      ? t<string>('errors.inputs.requiredWithLabel', { name: field })
      : t<string>('errors.inputs.required');
  }

  // check if the character limit has exceeded
  if (characterLimit) {
    byteLength = new TextEncoder().encode(value).byteLength;

    if (characterLimit - byteLength < 0) {
      return t<string>('errors.inputs.tooLong');
    }
  }

  // custom validations
  if (validate) {
    return validate(value);
  }

  return null;
}

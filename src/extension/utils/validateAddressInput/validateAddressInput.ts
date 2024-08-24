import { isValidAddress } from 'algosdk';

// types
import type { IOptions } from './types';

// utils
import validateInput from '@extension/utils/validateInput';

/**
 * Convenience function that validates whether an address input is valid.
 * @param {IOptions} options - the field name, a translation function, a custom validation function and the value.
 * @returns {string | null} the human-readable error or null if the value passed validation.
 */
export default function validateAddressInput({
  field,
  required = false,
  t,
  validate,
  value,
}: IOptions): string | null {
  const _error = validateInput({
    field,
    t,
    required,
    validate,
    value,
  });

  // check if the default input validates
  if (_error) {
    return _error;
  }

  // check if the address is valid
  if (!isValidAddress(value)) {
    return t<string>('errors.inputs.invalidAddress');
  }

  return null;
}

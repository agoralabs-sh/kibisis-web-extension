import { isValidAddress } from 'algosdk';
import { TFunction } from 'i18next';

/**
 * Validates the address. The address is valid if null is returned, otherwise the string will contain a human-readable
 * error.
 * @param {string} input - the input address.
 * @param {TFunction} t - translate function from i18next.
 * @returns {string | null} null if the address is valid, or if it is invalid, a string detailing a human-readable
 * error.
 */
export default function validate(input: string, t: TFunction): string | null {
  if (input.length <= 0) {
    return t<string>('errors.inputs.required', { name: 'Address' });
  }

  if (!isValidAddress(input)) {
    return t<string>('errors.inputs.invalidAddress');
  }

  return null;
}

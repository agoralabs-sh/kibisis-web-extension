import { TFunction } from 'i18next';

// Utils
import { isMnemonicValid } from '../../../utils';

export default function validate(
  phrases: string[],
  t: TFunction
): string | null {
  if (phrases.length < 25) {
    return t<string>('errors.inputs.unknown');
  }

  if (phrases.every((value) => value.length <= 0)) {
    return t<string>('errors.inputs.required', { name: 'Mnemonic phrase' });
  }

  if (!isMnemonicValid(phrases.join(' '))) {
    return t<string>('errors.inputs.invalidMnemonic');
  }

  return null;
}

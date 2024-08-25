import { TFunction } from 'i18next';

// utils
import isMnemonicValid from '@extension/utils/isMnemonicValid';

export default function validate(
  label: string,
  phrases: string[],
  t: TFunction
): string | null {
  if (phrases.length < 25) {
    return t<string>('errors.inputs.unknown');
  }

  if (phrases.every((value) => value.length <= 0)) {
    return t<string>('errors.inputs.requiredWithLabel', {
      name: label,
    });
  }

  if (!isMnemonicValid(phrases.join(' '))) {
    return t<string>('errors.inputs.invalidSeedPhrase');
  }

  return null;
}

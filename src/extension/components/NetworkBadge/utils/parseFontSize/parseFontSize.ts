// types
import type { TSizes } from '@extension/types';

export default function parseFontSize(size: TSizes): string {
  switch (size) {
    case 'lg':
      return 'xl';
    case 'md':
      return 'lg';
    case 'xs':
      return 'xs';
    case 'sm':
    default:
      return 'md';
  }
}

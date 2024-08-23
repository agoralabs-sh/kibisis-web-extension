// types
import type { TSizes } from '@extension/types';

export default function parsePadding(size: TSizes): number {
  switch (size) {
    case 'lg':
      return 4;
    case 'md':
      return 3;
    case 'xs':
      return 1;
    case 'sm':
    default:
      return 2;
  }
}

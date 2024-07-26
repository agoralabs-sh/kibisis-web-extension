// types
import type { TSizes } from '@extension/types';

export default function calculateIconSize(size?: TSizes): number {
  switch (size) {
    case 'lg':
      return 10;
    case 'md':
      return 6;
    case 'xl':
      return 16;
    case 'xs':
      return 3;
    case 'sm':
    default:
      return 4;
  }
}

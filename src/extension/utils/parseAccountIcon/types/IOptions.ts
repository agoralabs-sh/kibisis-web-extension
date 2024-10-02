import type { TAccountIcons, TSizes } from '@extension/types';

interface IOptions {
  accountIcon: TAccountIcons | null;
  color?: string;
  size?: TSizes;
}

export default IOptions;

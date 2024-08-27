import type { TFunction } from 'i18next';

interface IOptions {
  characterLimit?: number;
  field?: string;
  required?: boolean;
  t: TFunction;
  validate?: (value: string) => string | null;
  value: string;
}

export default IOptions;

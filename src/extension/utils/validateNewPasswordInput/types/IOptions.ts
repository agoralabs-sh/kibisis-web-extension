import type { TFunction } from 'i18next';

interface IOptions {
  field?: string;
  required?: boolean;
  score: number;
  t: TFunction;
  value: string;
}

export default IOptions;

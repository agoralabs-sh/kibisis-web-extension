import { TFunction } from 'i18next';

interface IOptions {
  field?: string;
  required?: boolean;
  t: TFunction;
  validate?: (value: string) => string | null;
  value: string;
}

export default IOptions;

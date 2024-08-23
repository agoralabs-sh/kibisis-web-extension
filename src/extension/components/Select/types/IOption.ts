import type { IconType } from 'react-icons';

interface IOption<Value = unknown> {
  icon?: IconType;
  label: string;
  value: Value;
}

export default IOption;

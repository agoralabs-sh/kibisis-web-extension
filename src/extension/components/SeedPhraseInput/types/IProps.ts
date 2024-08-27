// types
import type { IPropsWithContext } from '@extension/types';

interface IProps extends IPropsWithContext {
  disabled?: boolean;
  error: string | null;
  onChange: (phrases: string[]) => void;
  phrases: string[];
}

export default IProps;

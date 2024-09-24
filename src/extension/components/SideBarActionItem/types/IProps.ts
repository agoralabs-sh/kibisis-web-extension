import type { MouseEvent } from 'react';
import type { IconType } from 'react-icons';

/**
 * @property {boolean} isShortForm - Whether the full item is being shown or just the icon.
 */
interface IProps {
  icon: IconType;
  isShortForm: boolean;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default IProps;

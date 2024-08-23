import type { MouseEvent } from 'react';
import type { IconType } from 'react-icons';

interface IButtonProps {
  colorScheme?: string;
  icon?: IconType;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default IButtonProps;

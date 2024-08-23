import type { MouseEvent } from 'react';

interface IProps {
  buttonLabel: string;
  description?: string;
  isWarning?: boolean;
  label: string;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default IProps;

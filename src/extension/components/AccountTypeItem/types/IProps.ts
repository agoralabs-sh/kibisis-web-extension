import { ElementType } from 'react';

interface IProps {
  description: string;
  disabled?: boolean;
  icon: ElementType;
  onClick: () => void;
  title: string;
  tooltipText?: string;
}

export default IProps;

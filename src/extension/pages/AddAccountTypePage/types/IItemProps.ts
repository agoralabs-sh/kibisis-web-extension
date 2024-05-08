import { ElementType } from 'react';

interface IItemProps {
  description: string;
  disabled?: boolean;
  icon: ElementType;
  onClick: () => void;
  title: string;
  tooltipText?: string;
}

export default IItemProps;

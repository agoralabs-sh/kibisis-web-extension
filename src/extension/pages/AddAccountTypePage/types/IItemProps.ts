import { ElementType } from 'react';

interface IItemProps {
  description: string;
  icon: ElementType;
  isDisabled?: boolean;
  onClick: () => void;
  title: string;
  tooltipText?: string;
}

export default IItemProps;

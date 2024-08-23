// types
import type { IModalProps } from '@extension/types';
import type IOption from './IOption';

interface ISelectModalProps extends IModalProps {
  _context: string;
  emptySpaceMessage?: string;
  isOpen: boolean;
  onSelect: (index: number) => void;
  options: IOption[];
  selectedIndex?: number;
  title?: string;
}

export default ISelectModalProps;

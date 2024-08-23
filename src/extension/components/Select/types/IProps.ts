// types
import type IOption from './IOption';

interface IProps {
  _context: string;
  buttonTooltipLabel?: string;
  disabled?: boolean;
  emptyOptionLabel?: string;
  label?: string;
  modalTitle?: string;
  modalEmptySpaceMessage?: string;
  onSelect: (option: IOption | null) => void;
  options: IOption[];
  required?: boolean;
  value?: IOption;
}

export default IProps;

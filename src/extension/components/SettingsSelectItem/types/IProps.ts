// types
import type { IOption } from '@extension/components/Select';

interface IProps {
  _context: string;
  buttonTooltipLabel?: string;
  description?: string;
  disabled?: boolean;
  emptyOptionLabel: string;
  label: string;
  modalTitle?: string;
  modalEmptySpaceMessage?: string;
  onChange: (option: IOption) => void;
  options: IOption[];
  value: IOption | undefined;
  width?: string | number;
}

export default IProps;

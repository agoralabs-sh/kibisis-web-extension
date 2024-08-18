import type { IconType } from 'react-icons';

interface IMenuItemProps {
  icon?: IconType;
  label: string;
  onSelect: () => void;
}

export default IMenuItemProps;

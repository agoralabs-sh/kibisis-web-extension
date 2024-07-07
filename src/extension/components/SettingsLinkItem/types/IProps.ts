import type { IconType } from 'react-icons';

// types
import type IBadgeProps from './IBadgeProps';

interface IProps {
  badges?: IBadgeProps[];
  icon: IconType;
  label: string;
  to: string;
}

export default IProps;

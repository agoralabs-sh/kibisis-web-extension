import type { IconButtonProps } from '@chakra-ui/react';
import type { IconType } from 'react-icons';

interface IProps extends Omit<IconButtonProps, 'icon'> {
  icon: IconType;
}

export default IProps;

import type { StackProps } from '@chakra-ui/react';

// types
import type IButtonProps from './IButtonProps';

interface IProps extends StackProps {
  button?: IButtonProps;
  description?: string;
  text: string;
}

export default IProps;

import type { StackProps } from '@chakra-ui/react';

interface IProps extends StackProps {
  onScrollEnd?: () => void;
}

export default IProps;

import type { StackProps } from '@chakra-ui/react';

// types
import type { TSizes } from '@extension/types';

interface IProps extends StackProps {
  copyButtonLabel?: string;
  fontSize?: TSizes;
  isCode?: boolean;
  label: string;
  tooltipLabel?: string;
  value: string;
  warningLabel?: string;
}

export default IProps;

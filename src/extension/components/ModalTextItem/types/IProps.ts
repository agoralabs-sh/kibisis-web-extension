import { StackProps } from '@chakra-ui/react';

interface IProps extends StackProps {
  isCode?: boolean;
  label: string;
  tooltipLabel?: string;
  value: string;
  warningLabel?: string;
}

export default IProps;

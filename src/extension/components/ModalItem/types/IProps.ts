import { StackProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface IProps extends StackProps {
  label: string;
  tooltipLabel?: string;
  value: ReactNode;
  warningLabel?: string;
}

export default IProps;

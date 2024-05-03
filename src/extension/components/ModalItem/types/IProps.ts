import { StackProps } from '@chakra-ui/react';
import { ReactElement } from 'react';

interface IProps extends StackProps {
  label: string;
  tooltipLabel?: string;
  value: ReactElement;
  warningLabel?: string;
}

export default IProps;

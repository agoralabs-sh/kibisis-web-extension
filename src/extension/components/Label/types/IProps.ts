import type { StackProps } from '@chakra-ui/react';

interface IProps extends StackProps {
  error?: string | null;
  inputID?: string;
  label: string;
  required?: boolean;
}

export default IProps;

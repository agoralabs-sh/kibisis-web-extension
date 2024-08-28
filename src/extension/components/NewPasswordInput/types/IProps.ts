import type { InputProps } from '@chakra-ui/react';

interface IProps extends InputProps {
  error?: string | null;
  id?: string;
  label?: string;
  required?: boolean;
  score: number;
}

export default IProps;

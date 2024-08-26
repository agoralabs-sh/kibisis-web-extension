import type { InputProps } from '@chakra-ui/react';
import type { MutableRefObject } from 'react';

interface IProps extends InputProps {
  error?: string | null;
  id?: string;
  label?: string;
  ref?: MutableRefObject<HTMLInputElement | null>;
  required?: boolean;
  score: number;
}

export default IProps;

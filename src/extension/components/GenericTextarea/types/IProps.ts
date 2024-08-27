import type { TextareaProps } from '@chakra-ui/react';

interface IProps extends TextareaProps {
  charactersRemaining?: number;
  error?: string | null;
  id?: string;
  label: string;
  required?: boolean;
  validate?: (value: string) => string | null;
}

export default IProps;

import type { InputProps } from '@chakra-ui/react';

interface IProps extends InputProps {
  charactersRemaining?: number;
  error?: string | null;
  id?: string;
  informationText?: string;
  label: string;
  required?: boolean;
  validate?: (value: string) => string | null;
}

export default IProps;

import type { InputProps } from '@chakra-ui/react';

interface IProps extends Omit<InputProps, 'onError'> {
  characterLimit?: number;
  error?: string | null;
  id?: string;
  informationText?: string;
  label: string;
  onError?: (value: string | null) => void;
  required?: boolean;
  validate?: (value: string) => string | null;
}

export default IProps;

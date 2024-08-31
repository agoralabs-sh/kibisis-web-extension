import { useColorModeValue } from '@chakra-ui/react';

export default function useBorderColor(): string {
  return useColorModeValue('gray.300', 'whiteAlpha.400');
}

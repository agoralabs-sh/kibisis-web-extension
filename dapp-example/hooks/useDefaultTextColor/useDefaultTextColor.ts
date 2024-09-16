import { useColorModeValue } from '@chakra-ui/react';

export default function useDefaultTextColor(): string {
  return useColorModeValue('gray.600', 'whiteAlpha.800');
}

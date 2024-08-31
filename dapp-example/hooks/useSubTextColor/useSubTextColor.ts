import { useColorModeValue } from '@chakra-ui/react';

export default function useSubTextColor(): string {
  return useColorModeValue('gray.500', 'whiteAlpha.700');
}

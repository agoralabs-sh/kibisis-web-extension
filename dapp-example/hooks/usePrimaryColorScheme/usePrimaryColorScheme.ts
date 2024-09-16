import { useColorModeValue } from '@chakra-ui/react';

export default function usePrimaryColorScheme(): string {
  return useColorModeValue('primaryLight', 'primaryDark');
}

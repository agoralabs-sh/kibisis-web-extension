import { useColorModeValue } from '@chakra-ui/react';

export default function usePrimaryColor(): string {
  return useColorModeValue('primaryLight.500', 'primaryDark.500');
}

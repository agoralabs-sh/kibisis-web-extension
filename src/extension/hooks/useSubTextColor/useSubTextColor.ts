// Hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

export default function useSubTextColor(): string {
  return useColorModeValue('gray.500', 'whiteAlpha.700');
}

// Hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

export default function useBorderColor(): string {
  return useColorModeValue('gray.300', 'whiteAlpha.400');
}

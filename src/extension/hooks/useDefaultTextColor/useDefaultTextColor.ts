// Hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

export default function useDefaultTextColor(): string {
  return useColorModeValue('gray.500', 'whiteAlpha.800');
}

// Hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

export default function useTextBackgroundColor(): string {
  return useColorModeValue('gray.200', 'whiteAlpha.400');
}

// Hooks
import useColorModeValue from '../useColorModeValue';

export default function useTextBackgroundColor(): string {
  return useColorModeValue('gray.200', 'whiteAlpha.400');
}

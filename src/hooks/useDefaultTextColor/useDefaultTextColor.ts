// Hooks
import useColorModeValue from '../useColorModeValue';

export default function useDefaultTextColor(): string {
  return useColorModeValue('gray.500', 'whiteAlpha.800');
}

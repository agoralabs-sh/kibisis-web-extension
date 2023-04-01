// Hooks
import useColorModeValue from '../useColorModeValue';

export default function useBorderColor(): string {
  return useColorModeValue('gray.300', 'whiteAlpha.400');
}

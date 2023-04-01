// Hooks
import useColorModeValue from '../useColorModeValue';

export default function useSubTextColor(): string {
  return useColorModeValue('gray.400', 'whiteAlpha.600');
}

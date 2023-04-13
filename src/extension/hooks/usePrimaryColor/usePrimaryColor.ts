// Hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

export default function usePrimaryColor(): string {
  return useColorModeValue('primaryLight.500', 'primaryDark.500');
}

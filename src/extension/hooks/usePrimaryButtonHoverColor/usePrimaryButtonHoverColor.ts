// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

export default function usePrimaryButtonHoverColor(): string {
  return useColorModeValue('primaryLight.600', 'primaryDark.600');
}

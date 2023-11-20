// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

export default function usePrimaryColorScheme(): string {
  return useColorModeValue('primaryLight', 'primaryDark');
}

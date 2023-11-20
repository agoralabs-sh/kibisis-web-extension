// hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

export default function usePrimaryButtonTextColor(): string {
  return useColorModeValue('white', 'gray.800');
}

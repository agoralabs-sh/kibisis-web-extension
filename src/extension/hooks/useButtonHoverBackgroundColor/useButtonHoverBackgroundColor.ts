// Hooks
import useColorModeValue from '@extension/hooks/useColorModeValue';

export default function useButtonHoverBackgroundColor(): string {
  return useColorModeValue('gray.100', 'whiteAlpha.100');
}

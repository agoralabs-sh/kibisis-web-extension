// Hooks
import useColorModeValue from '../useColorModeValue';

export default function useButtonHoverBackgroundColor(): string {
  return useColorModeValue('gray.100', 'whiteAlpha.100');
}

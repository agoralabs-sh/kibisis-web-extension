// Selectors
import { useSelectColorMode } from '../../selectors';

export default function useColorModeValue<
  LightValue = unknown,
  DarkValue = unknown
>(lightValue: LightValue, darkValue: DarkValue): LightValue | DarkValue {
  if (useSelectColorMode() === 'dark') {
    return darkValue;
  }

  return lightValue;
}

import { ColorMode } from '@chakra-ui/react';
import * as CSS from 'csstype';

/**
 * @property {CSS.Property.FontFamily} font - The font family to render the app in.
 * @property {ColorMode} theme - Whether to use dark mode or light mode.
 */
interface IAppearanceSettings {
  font: CSS.Property.FontFamily;
  theme: ColorMode;
}

export default IAppearanceSettings;

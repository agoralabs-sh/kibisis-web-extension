import { StorageManager as ChakraStorageManager } from '@chakra-ui/color-mode/dist/storage-manager';
import { ColorMode } from '@chakra-ui/react';

export default class ColorModeManager implements ChakraStorageManager {
  // private variables
  private colorMode: ColorMode;
  // public variables
  public readonly type: 'cookie' | 'localStorage' = 'localStorage';

  constructor(colorMode: ColorMode) {
    this.colorMode = colorMode;
  }

  public get(init?: ColorMode): ColorMode | undefined {
    return this.colorMode;
  }

  public set(value: ColorMode): void {
    this.colorMode = value;
  }
}

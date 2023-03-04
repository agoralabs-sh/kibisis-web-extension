import { randomBytes } from 'crypto';

// Utils
import isHexString from './isHexString';
import toHexString from './toHexString';

describe('utils#toHexString()', () => {
  it('should convert bytes to hex string', () => {
    // Arrange
    const bytes: Uint8Array = new Uint8Array(randomBytes(32));
    // Act
    const result: string = toHexString(bytes);

    // Assert
    expect(isHexString(result)).toBe(true);
  });
});

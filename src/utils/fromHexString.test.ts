// Utils
import fromHexString from './fromHexString';
import isHexString from './isHexString';
import toHexString from './toHexString';

describe('utils#fromHexString()', () => {
  it('should convert a hex string to bytes', () => {
    // Arrange
    const hexString: string = '5de24fa8d70743787c18';
    // Act
    const bytes: Uint8Array = fromHexString(hexString);

    // Assert
    const result: string = toHexString(bytes);

    expect(isHexString(result)).toBe(true);
    expect(result).toBe(hexString);
  });
});

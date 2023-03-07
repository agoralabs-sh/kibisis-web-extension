// Utils
import hexStringToBytes from './hexStringToBytes';
import isHexString from './isHexString';
import bytesToHexString from './bytesToHexString';

describe('utils#hexStringToBytes()', () => {
  it('should convert a hex string to bytes', () => {
    // Arrange
    const hexString: string = '5de24fa8d70743787c18';
    // Act
    const bytes: Uint8Array = hexStringToBytes(hexString);

    // Assert
    const result: string = bytesToHexString(bytes);

    expect(isHexString(result)).toBe(true);
    expect(result).toBe(hexString);
  });
});

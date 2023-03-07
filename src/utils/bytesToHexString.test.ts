import { randomBytes } from 'crypto';

// Utils
import bytesToHexString from './bytesToHexString';
import isHexString from './isHexString';

describe('utils#bytesToHexString()', () => {
  it('should convert bytes to hex string', () => {
    // Arrange
    const bytes: Uint8Array = new Uint8Array(randomBytes(32));
    // Act
    const result: string = bytesToHexString(bytes);

    // Assert
    expect(isHexString(result)).toBe(true);
  });
});

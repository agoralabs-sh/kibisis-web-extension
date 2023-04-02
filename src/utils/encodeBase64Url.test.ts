import { randomBytes } from 'tweetnacl';

// Utils
import encodeBase64Url from './encodeBase64Url';

describe('encodeBase64Url()', () => {
  it('should successfully encode a string', () => {
    // Arrange
    const input: string = 'Hello human!';
    const expected: string = Buffer.from(input).toString('base64url');
    // Act
    const result: string = encodeBase64Url(input);

    // Assert
    expect(result).toBe(expected);
  });

  it('should throw an error if the input is not a unicode character', () => {
    // Arrange
    // Act
    try {
      encodeBase64Url(randomBytes(32));
    } catch (error) {
      // Assert
      expect(error).toMatchSnapshot();

      return;
    }

    throw new Error('should throw an InvalidCharacterError');
  });

  it('should successfully encode data', () => {
    // Arrange
    const encoder: TextEncoder = new TextEncoder();
    const input: string = 'Hello human!';
    const expected: string = Buffer.from(input).toString('base64url');
    // Act
    const result: string = encodeBase64Url(encoder.encode(input));

    // Assert
    expect(result).toBe(expected);
  });
});

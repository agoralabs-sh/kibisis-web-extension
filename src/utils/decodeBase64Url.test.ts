// Utils
import decodeBase64Url from './decodeBase64Url';

describe('decodeBase64Url()', () => {
  it('should successfully decode a string', () => {
    // Arrange
    const expected: string = 'Hello human!';
    const encodedBase64UrlInput: string =
      Buffer.from(expected).toString('base64url');
    // Act
    const result: string = decodeBase64Url(encodedBase64UrlInput);

    // Assert
    expect(result).toBe(expected);
  });
});

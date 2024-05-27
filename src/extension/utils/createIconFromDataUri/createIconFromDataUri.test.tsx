import { IconProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

// utils
import createIconFromDataUri from './createIconFromDataUri';

interface ITestParams {
  error: string;
  input: string;
}

describe('createIconFromDataUri()', () => {
  const props: IconProps = { h: 3, w: 3 };

  it.each([
    {
      error: 'is in the incorrect scheme incorrect scheme',
      input: 'unknown',
    },
    {
      error: 'no data found',
      input: 'data:image/svg+xml',
    },
    {
      error: 'no data found',
      input: 'data:image/svg+xml;base64,',
    },
    {
      error: 'not an svg image',
      input: 'data:,Hello%2C%20World%21',
    },
  ])(`should return null if the data uri $error`, ({ input }: ITestParams) => {
    expect(createIconFromDataUri(input, props)).toBeNull();
  });

  it('should return a an icon from a base64 encoded string', () => {
    // Arrange
    const dataUri: string = `data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNIDEwMCwgMTAwIG0gLTc1LCAwIGEgNzUsNzUgMCAxLDAgMTUwLDAgYSA3NSw3NSAwIDEsMCAtMTUwLDAiIC8+Cjwvc3ZnPgo=`;

    // Act
    const result: ReactNode | null = createIconFromDataUri(dataUri, props);

    // Assert
    expect(result).toMatchSnapshot();
  });

  it('should return a an icon from a string', () => {
    // Arrange
    const dataUri: string = `data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cpath%20d%3D%22M%20100%2C%20100%20m%20-75%2C%200%20a%2075%2C75%200%201%2C0%20150%2C0%20a%2075%2C75%200%201%2C0%20-150%2C0%22%20%2F%3E%0A%3C%2Fsvg%3E`;

    // Act
    const result: ReactNode | null = createIconFromDataUri(dataUri, props);

    // Assert
    expect(result).toMatchSnapshot();
  });
});

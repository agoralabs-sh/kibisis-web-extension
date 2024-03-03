// config
import { networks } from '@extension/config';

// types
import type { IARC0300BaseSchema } from '@extension/types';
import type { IOptions } from './types';

// utils
import createLogger from '@common/utils/createLogger';
import parseURIToARC0300Schema from './parseURIToARC0300Schema';

describe(`${__dirname}#parseURIToARC0300Schema()`, () => {
  const options: IOptions = {
    logger: createLogger('debug'),
    supportedNetworks: networks,
  };

  it('should return null for an invalid url', () => {
    // act
    const result: IARC0300BaseSchema | null = parseURIToARC0300Schema(
      'not a valid url',
      options
    );

    // assert
    expect(result).toBe(null);
  });

  it('should return null for it is not a valid arc0300 scheme', () => {
    // act
    const result: IARC0300BaseSchema | null = parseURIToARC0300Schema(
      'http://localhost:8080',
      options
    );

    // assert
    expect(result).toBe(null);
  });
});

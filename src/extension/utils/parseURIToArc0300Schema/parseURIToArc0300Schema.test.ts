import {
  encode as encodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
  decodeURLSafe as decodeBase64URLSafe,
} from '@stablelib/base64';
import { encode as encodeHex, decode as decodeHex } from '@stablelib/hex';
import { Account, generateAccount } from 'algosdk';

// constants
import { ARC_0300_PROTOCOL } from '@extension/constants';

// enums
import { Arc0300EncodingEnum, Arc0300MethodEnum } from '@extension/enums';

// types
import type { IBaseOptions } from '@common/types';
import { IArc0300BaseSchema, IArc0300ImportKeySchema } from '@extension/types';

// utils
import createLogger from '@common/utils/createLogger';
import parseURIToArc0300Schema from './parseURIToArc0300Schema';

describe(`${__dirname}#parseURIToArc0300Schema()`, () => {
  const options: IBaseOptions = {
    logger: createLogger('debug'),
  };

  it('should return null for an invalid url', () => {
    // act
    const result: IArc0300BaseSchema | null = parseURIToArc0300Schema(
      'not a valid url',
      options
    );

    // assert
    expect(result).toBe(null);
  });

  it('should return null for it is not a valid arc0300 scheme', () => {
    // act
    const result: IArc0300BaseSchema | null = parseURIToArc0300Schema(
      'http://localhost:8080',
      options
    );

    // assert
    expect(result).toBe(null);
  });

  describe('when parsing an import key uri', () => {
    it('should return null if no private key is provided', () => {
      // arrange
      const uri: string = `${ARC_0300_PROTOCOL}://${Arc0300MethodEnum.ImportKey}?encoding=hex`;
      // act
      const result: IArc0300ImportKeySchema | null =
        parseURIToArc0300Schema<IArc0300ImportKeySchema>(uri, options);

      // assert
      expect(result).toBe(null);
    });

    it('should return null if no encoding param is provided', () => {
      // arrange
      const account: Account = generateAccount();
      const uri: string = `${ARC_0300_PROTOCOL}://${
        Arc0300MethodEnum.ImportKey
      }/${encodeHex(account.sk)}`;
      // act
      const result: IArc0300ImportKeySchema | null =
        parseURIToArc0300Schema<IArc0300ImportKeySchema>(uri, options);

      // assert
      expect(result).toBe(null);
    });

    it('should return null if unsupported encoding is used', () => {
      // arrange
      const account: Account = generateAccount();
      const uri: string = `${ARC_0300_PROTOCOL}://${
        Arc0300MethodEnum.ImportKey
      }/${encodeBase64(account.sk)}?encoding=base64`;
      // act
      const result: IArc0300ImportKeySchema | null =
        parseURIToArc0300Schema<IArc0300ImportKeySchema>(uri, options);

      // assert
      expect(result).toBe(null);
    });

    it('should return a valid schema with hex encoding', () => {
      // arrange
      const account: Account = generateAccount();
      const uri: string = `${ARC_0300_PROTOCOL}://${
        Arc0300MethodEnum.ImportKey
      }/${encodeHex(account.sk)}?encoding=${Arc0300EncodingEnum.Hexadecimal}`;
      // act
      const result: IArc0300ImportKeySchema | null =
        parseURIToArc0300Schema<IArc0300ImportKeySchema>(uri, options);

      // assert
      if (!result) {
        throw new Error('failed to parse uri');
      }

      expect(result.method).toBe(Arc0300MethodEnum.ImportKey);
      expect(result.encoding).toBe(Arc0300EncodingEnum.Hexadecimal);
      expect(decodeHex(result.encodedPrivateKey)).toEqual(account.sk);
    });

    it('should return a valid schema with base63 url-safe encoding', () => {
      // arrange
      const account: Account = generateAccount();
      const uri: string = `${ARC_0300_PROTOCOL}://${
        Arc0300MethodEnum.ImportKey
      }/${encodeBase64URLSafe(account.sk)}?encoding=${
        Arc0300EncodingEnum.Base64URLSafe
      }`;
      // act
      const result: IArc0300ImportKeySchema | null =
        parseURIToArc0300Schema<IArc0300ImportKeySchema>(uri, options);

      // assert
      if (!result) {
        throw new Error('failed to parse uri');
      }

      expect(result.method).toBe(Arc0300MethodEnum.ImportKey);
      expect(result.encoding).toBe(Arc0300EncodingEnum.Base64URLSafe);
      expect(decodeBase64URLSafe(result.encodedPrivateKey)).toEqual(account.sk);
    });
  });
});

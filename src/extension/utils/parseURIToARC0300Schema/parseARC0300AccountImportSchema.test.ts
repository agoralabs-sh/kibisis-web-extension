import {
  decodeURLSafe as decodeBase64URLSafe,
  encode as encodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';
import { decode as decodeHex, encode as encodeHex } from '@stablelib/hex';
import { Account, generateAccount } from 'algosdk';

// constants
import { ARC_0026_SCHEME, ARC_0300_SCHEME } from '@extension/constants';

// config
import { networks } from '@extension/config';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300EncodingEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { IARC0300AccountImportSchema } from '@extension/types';
import type { IOptions } from './types';

// utils
import createLogger from '@common/utils/createLogger';
import parseURIToARC0300Schema from './parseURIToARC0300Schema';

describe(`${__dirname}#parseARC0300AccountImportSchema()`, () => {
  const options: IOptions = {
    logger: createLogger('debug'),
    supportedNetworks: networks,
  };

  it('should return null if no private key param is provided', () => {
    // arrange
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${ARC0300PathEnum.Import}?${ARC0300QueryEnum.Encoding}=${ARC0300EncodingEnum.Hexadecimal}`;
    // act
    const result: IARC0300AccountImportSchema | null =
      parseURIToARC0300Schema<IARC0300AccountImportSchema>(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if no encoding param is provided', () => {
    // arrange
    const account: Account = generateAccount();
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${
      ARC0300PathEnum.Import
    }?${ARC0300QueryEnum.PrivateKey}=${encodeHex(account.sk)}`;
    // act
    const result: IARC0300AccountImportSchema | null =
      parseURIToARC0300Schema<IARC0300AccountImportSchema>(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if unsupported encoding is used', () => {
    // arrange
    const account: Account = generateAccount();
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${
      ARC0300PathEnum.Import
    }?${ARC0300QueryEnum.PrivateKey}=${encodeBase64(account.sk)}?${
      ARC0300QueryEnum.Encoding
    }=base64`;
    // act
    const result: IARC0300AccountImportSchema | null =
      parseURIToARC0300Schema<IARC0300AccountImportSchema>(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return a valid schema with hex encoding', () => {
    // arrange
    const account: Account = generateAccount();
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${
      ARC0300PathEnum.Import
    }?${ARC0300QueryEnum.PrivateKey}=${encodeHex(account.sk)}&${
      ARC0300QueryEnum.Encoding
    }=${ARC0300EncodingEnum.Hexadecimal}`;
    // act
    const result: IARC0300AccountImportSchema | null =
      parseURIToARC0300Schema<IARC0300AccountImportSchema>(uri, options);

    // assert
    if (!result) {
      throw new Error('failed to parse uri');
    }

    expect(result.scheme).toBe(ARC_0300_SCHEME);
    expect(result.authority).toBe(ARC0300AuthorityEnum.Account);
    expect(result.paths).toEqual([ARC0300PathEnum.Import]);
    expect(result.query[ARC0300QueryEnum.Encoding]).toBe(
      ARC0300EncodingEnum.Hexadecimal
    );
    expect(decodeHex(result.query[ARC0300QueryEnum.PrivateKey])).toEqual(
      account.sk
    );
  });

  it('should return a valid schema with base63 url-safe encoding', () => {
    // arrange
    const account: Account = generateAccount();
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${
      ARC0300PathEnum.Import
    }?${ARC0300QueryEnum.PrivateKey}=${encodeBase64URLSafe(account.sk)}&${
      ARC0300QueryEnum.Encoding
    }=${ARC0300EncodingEnum.Base64URLSafe}`;
    // act
    const result: IARC0300AccountImportSchema | null =
      parseURIToARC0300Schema<IARC0300AccountImportSchema>(uri, options);

    // assert
    if (!result) {
      throw new Error('failed to parse uri');
    }

    expect(result.scheme).toBe(ARC_0300_SCHEME);
    expect(result.authority).toBe(ARC0300AuthorityEnum.Account);
    expect(result.paths).toEqual([ARC0300PathEnum.Import]);
    expect(result.query[ARC0300QueryEnum.Encoding]).toBe(
      ARC0300EncodingEnum.Base64URLSafe
    );
    expect(
      decodeBase64URLSafe(result.query[ARC0300QueryEnum.PrivateKey])
    ).toEqual(account.sk);
  });

  it('should return a valid schema with an arc-0026 scheme', () => {
    // arrange
    const account: Account = generateAccount();
    const uri: string = `${ARC_0026_SCHEME}://${ARC0300AuthorityEnum.Account}/${
      ARC0300PathEnum.Import
    }?${ARC0300QueryEnum.PrivateKey}=${encodeHex(account.sk)}&${
      ARC0300QueryEnum.Encoding
    }=${ARC0300EncodingEnum.Hexadecimal}`;
    // act
    const result: IARC0300AccountImportSchema | null =
      parseURIToARC0300Schema<IARC0300AccountImportSchema>(uri, options);

    // assert
    if (!result) {
      throw new Error('failed to parse uri');
    }

    expect(result.scheme).toBe(ARC_0026_SCHEME);
    expect(result.authority).toBe(ARC0300AuthorityEnum.Account);
    expect(result.paths).toEqual([ARC0300PathEnum.Import]);
    expect(result.query[ARC0300QueryEnum.Encoding]).toBe(
      ARC0300EncodingEnum.Hexadecimal
    );
    expect(decodeHex(result.query[ARC0300QueryEnum.PrivateKey])).toEqual(
      account.sk
    );
  });
});

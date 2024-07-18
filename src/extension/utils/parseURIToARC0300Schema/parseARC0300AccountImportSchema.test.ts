import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import SparkMD5 from 'spark-md5';
import { randomBytes } from 'tweetnacl';

// constants
import { ARC_0026_SCHEME, ARC_0300_SCHEME } from '@extension/constants';

// config
import { networks } from '@extension/config';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type { IARC0300AccountImportSchema } from '@extension/types';
import type { IOptions } from './types';

// utils
import createLogger from '@common/utils/createLogger';
import parseURIToARC0300Schema from './parseURIToARC0300Schema';

describe(`${__dirname}#parseARC0300AccountImportSchema`, () => {
  const options: IOptions = {
    logger: createLogger('debug'),
    supportedNetworks: networks,
  };

  it('should return null if no private key param is provided', () => {
    // arrange
    const uri = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Account}/${ARC0300PathEnum.Import}`;
    // act
    const result = parseURIToARC0300Schema<IARC0300AccountImportSchema>(
      uri,
      options
    );

    // assert
    expect(result).toBe(null);
  });

  it('should return a valid schema', () => {
    // arrange
    const keyPair = Ed21559KeyPair.generate();
    const queryParams = new URLSearchParams();
    let result: IARC0300AccountImportSchema | null;
    let uri: string = `${ARC_0026_SCHEME}://${ARC0300AuthorityEnum.Account}/${ARC0300PathEnum.Import}`;

    queryParams.append(
      ARC0300QueryEnum.PrivateKey,
      encodeBase64URLSafe(keyPair.privateKey)
    );

    uri = `${uri}?${queryParams.toString()}`;

    // act
    result = parseURIToARC0300Schema<IARC0300AccountImportSchema>(uri, options);

    // assert
    if (!result) {
      throw new Error('failed to parse uri');
    }

    expect(result.scheme).toBe(ARC_0300_SCHEME);
    expect(result.authority).toBe(ARC0300AuthorityEnum.Account);
    expect(result.paths).toEqual([ARC0300PathEnum.Import]);
    expect(
      result.query[ARC0300QueryEnum.PrivateKey].includes(
        encodeBase64URLSafe(keyPair.privateKey)
      )
    ).toBe(true);
  });

  it('should return a valid schema with an arc-0026 scheme', () => {
    // arrange
    const keyPair = Ed21559KeyPair.generate();
    const queryParams = new URLSearchParams();
    let result: IARC0300AccountImportSchema | null;
    let uri: string = `${ARC_0026_SCHEME}://${ARC0300AuthorityEnum.Account}/${ARC0300PathEnum.Import}`;

    queryParams.append(
      ARC0300QueryEnum.PrivateKey,
      encodeBase64URLSafe(keyPair.privateKey)
    );

    uri = `${uri}?${queryParams.toString()}`;

    // act
    result = parseURIToARC0300Schema<IARC0300AccountImportSchema>(uri, options);

    // assert
    if (!result) {
      throw new Error('failed to parse uri');
    }

    expect(result.scheme).toBe(ARC_0026_SCHEME);
    expect(result.authority).toBe(ARC0300AuthorityEnum.Account);
    expect(result.paths).toEqual([ARC0300PathEnum.Import]);
    expect(
      result.query[ARC0300QueryEnum.PrivateKey].includes(
        encodeBase64URLSafe(keyPair.privateKey)
      )
    ).toBe(true);
  });

  it.only('should return a valid schema with all query params', () => {
    // arrange
    const checksum = SparkMD5.ArrayBuffer.hash(randomBytes(32));
    const keyPair = Ed21559KeyPair.generate();
    const name = encodeHex(randomBytes(16)); // 32 byte string max
    const pageCount = 1;
    const pageTotal = 3;
    const queryParams = new URLSearchParams();
    let result: IARC0300AccountImportSchema | null;
    let uri: string = `${ARC_0026_SCHEME}://${ARC0300AuthorityEnum.Account}/${ARC0300PathEnum.Import}`;

    queryParams.append(
      ARC0300QueryEnum.PrivateKey,
      encodeBase64URLSafe(keyPair.privateKey)
    );
    queryParams.append(ARC0300QueryEnum.Name, name);
    queryParams.append(ARC0300QueryEnum.Checksum, checksum);
    queryParams.append(ARC0300QueryEnum.Page, `${pageCount}:${pageTotal}`);

    uri = `${uri}?${queryParams.toString()}`;

    // act
    result = parseURIToARC0300Schema<IARC0300AccountImportSchema>(uri, options);

    // assert
    if (!result) {
      throw new Error('failed to parse uri');
    }

    expect(result.scheme).toBe(ARC_0026_SCHEME);
    expect(result.authority).toBe(ARC0300AuthorityEnum.Account);
    expect(result.paths).toEqual([ARC0300PathEnum.Import]);
    expect(result.query[ARC0300QueryEnum.Checksum]).toBe(checksum);
    expect(result.query[ARC0300QueryEnum.Name].includes(name)).toBe(true);
    expect(result.query[ARC0300QueryEnum.Page]?.page).toBe(pageCount);
    expect(result.query[ARC0300QueryEnum.Page]?.total).toBe(pageTotal);
    expect(
      result.query[ARC0300QueryEnum.PrivateKey].includes(
        encodeBase64URLSafe(keyPair.privateKey)
      )
    ).toBe(true);
  });
});

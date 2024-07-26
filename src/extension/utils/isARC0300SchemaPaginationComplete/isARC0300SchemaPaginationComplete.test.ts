import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import SparkMD5 from 'spark-md5';
import { randomBytes } from 'tweetnacl';

// constants
import { ARC_0300_SCHEME } from '@extension/constants';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { IARC0300AccountImportSchema } from '@extension/types';

// utils
import isARC0300SchemaPaginationComplete from './isARC0300SchemaPaginationComplete';

describe(`${__dirname}#isARC0300SchemaPaginationComplete`, () => {
  it('should return true if there is one schema and it is not paginated', () => {
    // arrange
    const schemas: IARC0300AccountImportSchema[] = [
      {
        authority: ARC0300AuthorityEnum.Account,
        paths: [ARC0300PathEnum.Import],
        query: {
          [ARC0300QueryEnum.PrivateKey]: [encodeBase64URLSafe(randomBytes(32))],
        },
        scheme: ARC_0300_SCHEME,
      },
    ];

    // act
    // assert
    expect(isARC0300SchemaPaginationComplete(schemas)).toBe(true);
  });

  it(`should return false if the schema's checksums mismatch`, () => {
    // arrange
    const pageTotal = 2;
    const schemas: IARC0300AccountImportSchema[] = [
      {
        authority: ARC0300AuthorityEnum.Account,
        paths: [ARC0300PathEnum.Import],
        query: {
          [ARC0300QueryEnum.Checksum]: SparkMD5.ArrayBuffer.hash(
            randomBytes(32)
          ),
          [ARC0300QueryEnum.Page]: {
            page: 0,
            total: pageTotal,
          },
          [ARC0300QueryEnum.PrivateKey]: [encodeBase64URLSafe(randomBytes(32))],
        },
        scheme: ARC_0300_SCHEME,
      },
      {
        authority: ARC0300AuthorityEnum.Account,
        paths: [ARC0300PathEnum.Import],
        query: {
          [ARC0300QueryEnum.Checksum]: SparkMD5.ArrayBuffer.hash(
            randomBytes(32)
          ),
          [ARC0300QueryEnum.Page]: {
            page: 1,
            total: pageTotal,
          },
          [ARC0300QueryEnum.PrivateKey]: [encodeBase64URLSafe(randomBytes(32))],
        },
        scheme: ARC_0300_SCHEME,
      },
    ];

    // act
    // assert
    expect(isARC0300SchemaPaginationComplete(schemas)).toBe(false);
  });

  it(`should return false if the not all the schema's pages are present`, () => {
    // arrange
    const checksum = SparkMD5.ArrayBuffer.hash(randomBytes(32));
    const pageTotal = 3;
    const schemas: IARC0300AccountImportSchema[] = [
      {
        authority: ARC0300AuthorityEnum.Account,
        paths: [ARC0300PathEnum.Import],
        query: {
          [ARC0300QueryEnum.Checksum]: checksum,
          [ARC0300QueryEnum.Page]: {
            page: 0,
            total: pageTotal,
          },
          [ARC0300QueryEnum.PrivateKey]: [encodeBase64URLSafe(randomBytes(32))],
        },
        scheme: ARC_0300_SCHEME,
      },
      // missing the second page: page 1
      {
        authority: ARC0300AuthorityEnum.Account,
        paths: [ARC0300PathEnum.Import],
        query: {
          [ARC0300QueryEnum.Checksum]: checksum,
          [ARC0300QueryEnum.Page]: {
            page: 2,
            total: pageTotal,
          },
          [ARC0300QueryEnum.PrivateKey]: [encodeBase64URLSafe(randomBytes(32))],
        },
        scheme: ARC_0300_SCHEME,
      },
    ];

    // act
    // assert
    expect(isARC0300SchemaPaginationComplete(schemas)).toBe(false);
  });

  it(`should return true if the all the schema's pages are present`, () => {
    // arrange
    const checksum = SparkMD5.ArrayBuffer.hash(randomBytes(32));
    const pageTotal = 2;
    const schemas: IARC0300AccountImportSchema[] = [
      {
        authority: ARC0300AuthorityEnum.Account,
        paths: [ARC0300PathEnum.Import],
        query: {
          [ARC0300QueryEnum.Checksum]: checksum,
          [ARC0300QueryEnum.Page]: {
            page: 0,
            total: pageTotal,
          },
          [ARC0300QueryEnum.PrivateKey]: [encodeBase64URLSafe(randomBytes(32))],
        },
        scheme: ARC_0300_SCHEME,
      },
      {
        authority: ARC0300AuthorityEnum.Account,
        paths: [ARC0300PathEnum.Import],
        query: {
          [ARC0300QueryEnum.Checksum]: checksum,
          [ARC0300QueryEnum.Page]: {
            page: 1,
            total: pageTotal,
          },
          [ARC0300QueryEnum.PrivateKey]: [encodeBase64URLSafe(randomBytes(32))],
        },
        scheme: ARC_0300_SCHEME,
      },
    ];

    // act
    // assert
    expect(isARC0300SchemaPaginationComplete(schemas)).toBe(true);
  });
});

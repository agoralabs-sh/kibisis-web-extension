import { encodeURLSafe as encodeBase64URLSafe } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { randomBytes } from 'tweetnacl';

// constants
import {
  EXPORT_ACCOUNT_PAGE_LIMIT,
  ARC_0300_SCHEME,
} from '@extension/constants';

// enums
import {
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type {
  IARC0300AccountImportSchema,
  IARC0300PaginationQueryItem,
} from '@extension/types';
import type { IExportAccount } from './types';

// utils
import createLogger from '@common/utils/createLogger';
import parseURIToARC0300Schema from '../parseURIToARC0300Schema';
import createAccountImportURI from './createAccountImportURI';

/**
 * Convenience function that simply assets the checksums match.
 * @param {(IARC0300AccountImportSchema | null)[]} schemas - a list of schemas to check.
 */
function assertChecksumMatches(
  schemas: (IARC0300AccountImportSchema | null)[]
): void {
  const match = schemas.every(
    (value, _, array) =>
      value?.query[ARC0300QueryEnum.Checksum] ===
      array[0]?.query[ARC0300QueryEnum.Checksum]
  );

  expect(match).toBe(true);
}

/**
 * Convenience function that simply asserts that the schema is valid. This does not assert the query params.
 * @param {IARC0300AccountImportSchema | null} schema - the schema to assert.
 */
function assertSchemaWithoutQueryParams(
  schema: IARC0300AccountImportSchema | null
): void {
  expect(schema).not.toBeNull();
  expect(schema?.scheme).toBe(ARC_0300_SCHEME);
  expect(schema?.authority).toBe(ARC0300AuthorityEnum.Account);
  expect(schema?.paths).toHaveLength(1);
  expect(schema?.paths[0]).toBe(ARC0300PathEnum.Import);
}

describe(`${__dirname}#createAccountImportURI`, () => {
  const logger = createLogger('silent');

  describe('when there is a single account', () => {
    it('should return a schema for a single unnamed account', () => {
      // arrange
      const keyPair = Ed21559KeyPair.generate();
      // act
      const result = createAccountImportURI({
        accounts: [
          {
            privateKey: keyPair.privateKey,
          },
        ],
      });
      let schema: IARC0300AccountImportSchema | null;

      // assert
      expect(result).toHaveLength(1);

      schema = parseURIToARC0300Schema<IARC0300AccountImportSchema>(result[0], {
        logger,
        supportedNetworks: [],
      });

      assertSchemaWithoutQueryParams(schema);

      expect(schema?.query[ARC0300QueryEnum.Name]).toHaveLength(0);
      expect(schema?.query[ARC0300QueryEnum.PrivateKey]).toHaveLength(1);
      expect(schema?.query[ARC0300QueryEnum.PrivateKey][0]).toBe(
        encodeBase64URLSafe(keyPair.privateKey)
      );
    });

    it('should return a schema for a single named account', () => {
      // arrange
      const keyPair = Ed21559KeyPair.generate();
      const name = encodeHex(randomBytes(16)); // 32 byte string max
      // act
      const result = createAccountImportURI({
        accounts: [
          {
            name,
            privateKey: keyPair.privateKey,
          },
        ],
      });
      let schema: IARC0300AccountImportSchema | null;

      // assert
      expect(result).toHaveLength(1);

      schema = parseURIToARC0300Schema<IARC0300AccountImportSchema>(result[0], {
        logger,
        supportedNetworks: [],
      });

      assertSchemaWithoutQueryParams(schema);

      expect(schema?.query[ARC0300QueryEnum.Name]).toHaveLength(1);
      expect(schema?.query[ARC0300QueryEnum.Name]?.includes(name)).toBe(true);
      expect(schema?.query[ARC0300QueryEnum.PrivateKey]).toHaveLength(1);
      expect(schema?.query[ARC0300QueryEnum.PrivateKey][0]).toBe(
        encodeBase64URLSafe(keyPair.privateKey)
      );
    });
  });

  describe('when there is multiple accounts under the account limit', () => {
    it('should return a schema for multiple unnamed accounts', () => {
      // arrange
      const accounts: IExportAccount[] = Array.from(
        { length: EXPORT_ACCOUNT_PAGE_LIMIT - 1 },
        () => ({
          privateKey: Ed21559KeyPair.generate().privateKey,
        })
      );
      // act
      const result = createAccountImportURI({
        accounts,
      });
      let schema: IARC0300AccountImportSchema | null;

      // assert
      expect(result).toHaveLength(1);

      schema = parseURIToARC0300Schema<IARC0300AccountImportSchema>(result[0], {
        logger,
        supportedNetworks: [],
      });

      assertSchemaWithoutQueryParams(schema);

      expect(schema?.query[ARC0300QueryEnum.Name]).toHaveLength(0);
      expect(schema?.query[ARC0300QueryEnum.PrivateKey]).toHaveLength(
        accounts.length
      );
      schema?.query[ARC0300QueryEnum.PrivateKey].forEach((value, index) =>
        expect(value).toBe(encodeBase64URLSafe(accounts[index].privateKey))
      );
    });

    it('should return a schema for multiple named accounts', () => {
      // arrange
      const accounts: IExportAccount[] = Array.from(
        { length: EXPORT_ACCOUNT_PAGE_LIMIT - 1 },
        () => ({
          name: encodeHex(randomBytes(16)), // 32 byte string max
          privateKey: Ed21559KeyPair.generate().privateKey,
        })
      );
      // act
      const result = createAccountImportURI({
        accounts,
      });
      let schema: IARC0300AccountImportSchema | null;

      // assert
      expect(result).toHaveLength(1);

      schema = parseURIToARC0300Schema<IARC0300AccountImportSchema>(result[0], {
        logger,
        supportedNetworks: [],
      });

      assertSchemaWithoutQueryParams(schema);

      expect(schema?.query[ARC0300QueryEnum.Name]).toHaveLength(
        accounts.length
      );
      schema?.query[ARC0300QueryEnum.Name]?.forEach((value, index) =>
        expect(value).toBe(accounts[index].name)
      );
      expect(schema?.query[ARC0300QueryEnum.PrivateKey]).toHaveLength(
        accounts.length
      );
      schema?.query[ARC0300QueryEnum.PrivateKey].forEach((value, index) =>
        expect(value).toBe(encodeBase64URLSafe(accounts[index].privateKey))
      );
    });

    it('should return a schema for multiple named and unnamed accounts', () => {
      // arrange
      const accounts: IExportAccount[] = Array.from(
        { length: EXPORT_ACCOUNT_PAGE_LIMIT - 1 },
        (_, index) => ({
          privateKey: Ed21559KeyPair.generate().privateKey,
          // only add evens
          ...(index % 2 === 0 && {
            name: encodeHex(randomBytes(16)), // 32 byte string max
          }),
        })
      );
      const namedAccounts = accounts.filter(({ name }) => !!name);
      const unnamedAccounts = accounts.filter(({ name }) => !name);
      const sortedAccounts = [...namedAccounts, ...unnamedAccounts];
      // act
      const result = createAccountImportURI({
        accounts,
      });
      let schema: IARC0300AccountImportSchema | null;

      // assert
      expect(result).toHaveLength(1);

      schema = parseURIToARC0300Schema<IARC0300AccountImportSchema>(result[0], {
        logger,
        supportedNetworks: [],
      });

      assertSchemaWithoutQueryParams(schema);

      expect(schema?.query[ARC0300QueryEnum.Name]).toHaveLength(
        namedAccounts.length
      );
      schema?.query[ARC0300QueryEnum.Name]?.forEach((value, index) =>
        expect(value).toBe(namedAccounts[index].name)
      );
      expect(schema?.query[ARC0300QueryEnum.PrivateKey]).toHaveLength(
        accounts.length
      );
      schema?.query[ARC0300QueryEnum.PrivateKey].forEach((value, index) =>
        expect(value).toBe(
          encodeBase64URLSafe(sortedAccounts[index].privateKey)
        )
      );
    });
  });

  describe('when there is multiple accounts over the account limit', () => {
    it('should return a schema for multiple unnamed accounts', () => {
      // arrange
      const accounts: IExportAccount[] = Array.from(
        { length: EXPORT_ACCOUNT_PAGE_LIMIT + 1 },
        () => ({
          privateKey: Ed21559KeyPair.generate().privateKey,
        })
      );
      // act
      const result = createAccountImportURI({
        accounts,
      });
      let expectedLastPageItems: number;
      let pagination: IARC0300PaginationQueryItem | null;
      let schemas: (IARC0300AccountImportSchema | null)[];

      // assert
      expect(result).toHaveLength(
        Math.ceil(accounts.length / EXPORT_ACCOUNT_PAGE_LIMIT)
      );

      schemas = result.map((value) =>
        parseURIToARC0300Schema<IARC0300AccountImportSchema>(value, {
          logger,
          supportedNetworks: [],
        })
      );

      assertChecksumMatches(schemas);

      schemas.forEach((value) => {
        assertSchemaWithoutQueryParams(value);

        pagination = value?.query[ARC0300QueryEnum.Page] || null;

        expect(pagination).toBeDefined();
        expect(value?.query[ARC0300QueryEnum.Name]).toHaveLength(0);

        if (pagination) {
          expectedLastPageItems =
            accounts.length -
            EXPORT_ACCOUNT_PAGE_LIMIT * (pagination.total - 1);

          // for pages that are not the last page, they should contain 5 accounts, the last page should contain 1-5 accounts
          expect(value?.query[ARC0300QueryEnum.PrivateKey]).toHaveLength(
            pagination.page < pagination.total
              ? EXPORT_ACCOUNT_PAGE_LIMIT
              : expectedLastPageItems
          );
        }
      });
    });

    it('should return a schema for multiple unnamed accounts', () => {
      // arrange
      const accounts: IExportAccount[] = Array.from(
        { length: EXPORT_ACCOUNT_PAGE_LIMIT },
        () => ({
          name: encodeHex(randomBytes(16)), // 32 byte string max
          privateKey: Ed21559KeyPair.generate().privateKey,
        })
      );
      // act
      const result = createAccountImportURI({
        accounts,
      });
      let expectedLastPageItems: number;
      let pagination: IARC0300PaginationQueryItem | null;
      let schemas: (IARC0300AccountImportSchema | null)[];

      // assert
      expect(result).toHaveLength(
        Math.ceil(accounts.length / EXPORT_ACCOUNT_PAGE_LIMIT)
      );

      schemas = result.map((value) =>
        parseURIToARC0300Schema<IARC0300AccountImportSchema>(value, {
          logger,
          supportedNetworks: [],
        })
      );

      assertChecksumMatches(schemas);

      schemas.forEach((value) => {
        assertSchemaWithoutQueryParams(value);

        pagination = value?.query[ARC0300QueryEnum.Page] || null;

        expect(pagination).toBeDefined();

        if (pagination) {
          expectedLastPageItems =
            accounts.length - EXPORT_ACCOUNT_PAGE_LIMIT * pagination.total;

          // for pages that are not the last page, they should contain 5 accounts, the last page should contain 1-5 accounts
          expect(value?.query[ARC0300QueryEnum.Name]).toHaveLength(
            pagination.page < pagination.total
              ? EXPORT_ACCOUNT_PAGE_LIMIT
              : expectedLastPageItems
          );
          expect(value?.query[ARC0300QueryEnum.PrivateKey]).toHaveLength(
            pagination.page < pagination.total
              ? EXPORT_ACCOUNT_PAGE_LIMIT
              : expectedLastPageItems
          );
        }
      });
    });
  });
});

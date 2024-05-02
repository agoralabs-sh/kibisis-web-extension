import {
  decode as decodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';

// constants
import { ARC_0300_SCHEME } from '@extension/constants';

// config
import { networks } from '@extension/config';

// enums
import {
  ARC0300AssetTypeEnum,
  ARC0300AuthorityEnum,
  ARC0300PathEnum,
  ARC0300QueryEnum,
} from '@extension/enums';

// types
import type { IARC0300AssetAddSchema } from '@extension/types';
import type { IOptions } from './types';

// utils
import createLogger from '@common/utils/createLogger';
import parseURIToARC0300Schema from './parseURIToARC0300Schema';

describe(`${__dirname}#parseARC0300AssetAddSchema()`, () => {
  const options: IOptions = {
    logger: createLogger('debug'),
    supportedNetworks: networks,
  };
  const genesisHashURLSafe: string = encodeBase64URLSafe(
    decodeBase64(networks[0].genesisHash)
  );
  const assetId: string = '1234567890';

  it('should return null if no the asset id path was provided', () => {
    // arrange
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Asset}/${ARC0300PathEnum.Add}?${ARC0300QueryEnum.GenesisHash}=${genesisHashURLSafe}&${ARC0300QueryEnum.Type}=${ARC0300AssetTypeEnum.ARC0200}`;
    // act
    const result: IARC0300AssetAddSchema | null =
      parseURIToARC0300Schema<IARC0300AssetAddSchema>(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the asset id is invalid', () => {
    // arrange
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Asset}/${ARC0300PathEnum.Add}/not-valid?${ARC0300QueryEnum.GenesisHash}=${genesisHashURLSafe}&${ARC0300QueryEnum.Type}=${ARC0300AssetTypeEnum.ARC0200}`;
    // act
    const result: IARC0300AssetAddSchema | null =
      parseURIToARC0300Schema<IARC0300AssetAddSchema>(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if no genesis hash param is provided', () => {
    // arrange
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Asset}/${ARC0300PathEnum.Add}/${assetId}?${ARC0300QueryEnum.Type}=${ARC0300AssetTypeEnum.ARC0200}`;
    // act
    const result: IARC0300AssetAddSchema | null =
      parseURIToARC0300Schema<IARC0300AssetAddSchema>(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the genesis hash is not supported', () => {
    // arrange
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Asset}/${ARC0300PathEnum.Add}/${assetId}?${ARC0300QueryEnum.GenesisHash}=${genesisHashURLSafe}&${ARC0300QueryEnum.Type}=${ARC0300AssetTypeEnum.ARC0200}`;
    // act
    const result: IARC0300AssetAddSchema | null =
      parseURIToARC0300Schema<IARC0300AssetAddSchema>(uri, {
        ...options,
        supportedNetworks: networks.filter((_, index) => index > 0), // remove the first network as it is used in the URI
      });

    // assert
    expect(result).toBe(null);
  });

  it('should return null if no type param is provided', () => {
    // arrange
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Asset}/${ARC0300PathEnum.Add}/${assetId}?${ARC0300QueryEnum.GenesisHash}=${genesisHashURLSafe}`;
    // act
    const result: IARC0300AssetAddSchema | null =
      parseURIToARC0300Schema<IARC0300AssetAddSchema>(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the type param is not supported', () => {
    // arrange
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Asset}/${ARC0300PathEnum.Add}/${assetId}?${ARC0300QueryEnum.GenesisHash}=${genesisHashURLSafe}&${ARC0300QueryEnum.Type}=not-known`;
    // act
    const result: IARC0300AssetAddSchema | null =
      parseURIToARC0300Schema<IARC0300AssetAddSchema>(uri, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return a valid schema', () => {
    // arrange
    const uri: string = `${ARC_0300_SCHEME}://${ARC0300AuthorityEnum.Asset}/${ARC0300PathEnum.Add}/${assetId}?${ARC0300QueryEnum.GenesisHash}=${genesisHashURLSafe}&${ARC0300QueryEnum.Type}=${ARC0300AssetTypeEnum.ARC0200}`;
    // act
    const result: IARC0300AssetAddSchema | null =
      parseURIToARC0300Schema<IARC0300AssetAddSchema>(uri, options);

    // assert
    if (!result) {
      throw new Error('failed to parse uri');
    }

    expect(result.scheme).toBe(ARC_0300_SCHEME);
    expect(result.authority).toBe(ARC0300AuthorityEnum.Asset);
    expect(result.paths).toEqual([ARC0300PathEnum.Add, assetId]);
    expect(result.query[ARC0300QueryEnum.GenesisHash]).toBe(
      networks[0].genesisHash
    );
    expect(result.query[ARC0300QueryEnum.Type]).toEqual(
      ARC0300AssetTypeEnum.ARC0200
    );
  });
});

import { generateAccount, TransactionType } from 'algosdk';
import {
  decode as decodeBase64,
  encodeURLSafe as encodeBase64URLSafe,
} from '@stablelib/base64';

// config
import { networks } from '@extension/config';

// enums
import { ARC0300QueryEnum } from '@extension/enums';

// types
import type { IOptions } from './types';

// utils
import createLogger from '@common/utils/createLogger';
import parseARC0300CommonTransactionSendQuery from './parseARC0300CommonTransactionSendQuery';

describe(`${__dirname}#parseARC0300CommonTransactionSendQuery()`, () => {
  const sender = generateAccount().addr;
  const options: IOptions = {
    logger: createLogger('debug'),
    supportedNetworks: networks,
  };

  it('should return null if no "sender" param is present', () => {
    // arrange
    const query = new URLSearchParams({
      [ARC0300QueryEnum.Type]: TransactionType.pay,
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "sender" param is not a valid address', () => {
    // arrange
    const query = new URLSearchParams({
      [ARC0300QueryEnum.Sender]: 'unknown-sender',
      [ARC0300QueryEnum.Type]: TransactionType.pay,
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "type" param is missing', () => {
    // arrange
    const query = new URLSearchParams({
      [ARC0300QueryEnum.Sender]: sender,
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "type" param is not a transaction type', () => {
    // arrange
    const query = new URLSearchParams({
      [ARC0300QueryEnum.Sender]: sender,
      [ARC0300QueryEnum.Type]: 'not-a-type',
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "genesishash" param is supplied, but not supported', () => {
    // arrange
    const genesisHashURLSafe: string = encodeBase64URLSafe(
      decodeBase64(networks[0].genesisHash)
    );
    const query = new URLSearchParams({
      [ARC0300QueryEnum.GenesisHash]: genesisHashURLSafe,
      [ARC0300QueryEnum.Sender]: sender,
      [ARC0300QueryEnum.Type]: TransactionType.pay,
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, {
      ...options,
      supportedNetworks: networks.filter((_, index) => index > 0), // remove the first network as it is used in the uri
    });

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "fee" param is supplied, but is not a numeric value', () => {
    // arrange
    const query = new URLSearchParams({
      [ARC0300QueryEnum.Fee]: 'not-numeric',
      [ARC0300QueryEnum.Sender]: sender,
      [ARC0300QueryEnum.Type]: TransactionType.pay,
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "firstvalid" param is supplied, but is not a numeric value', () => {
    // arrange
    const query = new URLSearchParams({
      [ARC0300QueryEnum.FirstValid]: 'not-numeric',
      [ARC0300QueryEnum.Sender]: sender,
      [ARC0300QueryEnum.Type]: TransactionType.pay,
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "lastvalid" param is supplied, but is not a numeric value', () => {
    // arrange
    const query = new URLSearchParams({
      [ARC0300QueryEnum.LastValid]: 'not-numeric',
      [ARC0300QueryEnum.Sender]: sender,
      [ARC0300QueryEnum.Type]: TransactionType.pay,
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return null if the "rekeyto" param is supplied, but is not a valid address', () => {
    // arrange
    const query = new URLSearchParams({
      [ARC0300QueryEnum.ReyKeyTo]: 'not-a-valid-address',
      [ARC0300QueryEnum.Sender]: sender,
      [ARC0300QueryEnum.Type]: TransactionType.pay,
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, options);

    // assert
    expect(result).toBe(null);
  });

  it('should return a valid query', () => {
    // arrange
    const fee = '1000';
    const firstValid = '6000000';
    const genesisHash = networks[0].genesisHash;
    const group = 'gFIrHowwnLDbttHKxvIg/g==';
    const lease = 'QtXMT0RluAFiq1OaJz+LzA==';
    const note = 'SGVsbG8gV29ybGQ=';
    const lastValid = '6000000';
    const reKeyTo =
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4';
    const query = new URLSearchParams({
      [ARC0300QueryEnum.Fee]: fee,
      [ARC0300QueryEnum.FirstValid]: firstValid,
      [ARC0300QueryEnum.GenesisHash]: encodeBase64URLSafe(
        decodeBase64(genesisHash)
      ),
      [ARC0300QueryEnum.Group]: encodeBase64URLSafe(decodeBase64(group)),
      [ARC0300QueryEnum.LastValid]: lastValid,
      [ARC0300QueryEnum.Lease]: encodeBase64URLSafe(decodeBase64(lease)),
      [ARC0300QueryEnum.Note]: encodeBase64URLSafe(decodeBase64(note)),
      [ARC0300QueryEnum.ReyKeyTo]: reKeyTo,
      [ARC0300QueryEnum.Sender]: sender,
      [ARC0300QueryEnum.Type]: TransactionType.pay,
    });
    // act
    const result = parseARC0300CommonTransactionSendQuery(query, options);

    // assert
    if (!result) {
      throw new Error('failed to parse common query');
    }

    expect(result[ARC0300QueryEnum.Fee]).toBe(fee);
    expect(result[ARC0300QueryEnum.FirstValid]).toBe(firstValid);
    expect(result[ARC0300QueryEnum.GenesisHash]).toBe(genesisHash);
    expect(result[ARC0300QueryEnum.Group]).toBe(group);
    expect(result[ARC0300QueryEnum.LastValid]).toBe(lastValid);
    expect(result[ARC0300QueryEnum.Lease]).toBe(lease);
    expect(result[ARC0300QueryEnum.Note]).toBe(note);
    expect(result[ARC0300QueryEnum.ReyKeyTo]).toBe(reKeyTo);
    expect(result[ARC0300QueryEnum.Sender]).toBe(sender);
    expect(result[ARC0300QueryEnum.Type]).toBe(TransactionType.pay);
  });
});

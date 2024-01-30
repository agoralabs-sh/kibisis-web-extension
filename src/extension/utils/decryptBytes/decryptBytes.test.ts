import { faker } from '@faker-js/faker';
import { encode as encodeHex } from '@stablelib/hex';
import { Account, generateAccount } from 'algosdk';

// types
import type { ILogger } from '@common/types';

// utils
import createLogger from '@common/utils/createLogger';
import encryptBytes from '../encryptBytes';
import decryptBytes from './decryptBytes';

describe('decryptBytes', () => {
  let account: Account;
  let logger: ILogger;
  let secret: string;

  beforeAll(() => {
    logger = createLogger('silent');
  });

  beforeEach(() => {
    account = generateAccount();
    secret = faker.internet.password(10);
  });

  it('should encrypt and decrypt a private key', async () => {
    // arrange
    const encryptedPrivateKey: Uint8Array = await encryptBytes(
      account.sk,
      secret,
      { logger }
    );
    // Act
    const decryptedPrivateKey: Uint8Array = await decryptBytes(
      encryptedPrivateKey,
      secret,
      { logger }
    );

    // assert
    expect(encodeHex(decryptedPrivateKey)).toBe(encodeHex(account.sk));
  });
});

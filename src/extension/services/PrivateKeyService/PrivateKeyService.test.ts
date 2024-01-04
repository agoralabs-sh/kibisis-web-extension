import { faker } from '@faker-js/faker';
import { encode as encodeHex } from '@stablelib/hex';
import { Account, generateAccount } from 'algosdk';

// services
import PrivateKeyService from './PrivateKeyService';

// types
import type { ILogger } from '@common/types';

// utils
import createLogger from '@common/utils/createLogger';

describe(PrivateKeyService.name, () => {
  let account: Account;
  let logger: ILogger;
  let password: string;

  beforeAll(() => {
    logger = createLogger('silent');
  });

  beforeEach(() => {
    account = generateAccount();
    password = faker.internet.password(10);
  });

  describe(`${PrivateKeyService.name}#decrypt`, () => {
    it('should encrypt and decrypt a private key', async () => {
      // Arrange
      const encryptedPrivateKey: Uint8Array = await PrivateKeyService.encrypt(
        account.sk,
        password,
        { logger }
      );
      // Act
      const decryptedPrivateKey: Uint8Array = await PrivateKeyService.decrypt(
        encryptedPrivateKey,
        password,
        { logger }
      );

      // Assert
      expect(encodeHex(decryptedPrivateKey)).toBe(encodeHex(account.sk));
    });
  });
});

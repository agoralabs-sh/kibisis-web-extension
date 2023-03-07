import { faker } from '@faker-js/faker';
import { Account, generateAccount, secretKeyToMnemonic } from 'algosdk';

// Services
import PrivateKeyService from './PrivateKeyService';

// Types
import type { ILogger } from '../types';

// Utils
import { createLogger } from '../utils';

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
      const mnemonic: string = secretKeyToMnemonic(account.sk);
      const encryptedPrivateKey: string = await PrivateKeyService.encrypt(
        password,
        mnemonic,
        { logger }
      );
      // Act
      const decryptedPrivateKey: string = await PrivateKeyService.decrypt(
        encryptedPrivateKey,
        password,
        { logger }
      );

      // Assert
      expect(decryptedPrivateKey).toBe(mnemonic);
    });
  });
});

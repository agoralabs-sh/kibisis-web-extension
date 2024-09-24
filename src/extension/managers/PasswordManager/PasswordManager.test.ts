import { faker } from '@faker-js/faker';
import { encode as encodeHex } from '@stablelib/hex';
import { generateAccount } from 'algosdk';

// services
import PasswordManager from './PasswordManager';

// types
import type { ILogger } from '@common/types';

// utils
import createLogger from '@common/utils/createLogger';

describe(PasswordManager.name, () => {
  let logger: ILogger;

  beforeAll(() => {
    logger = createLogger('silent');
  });

  it('should encrypt and decrypt a private key', async () => {
    // arrange
    const password = faker.internet.password(10);
    const privateKey = generateAccount().sk;
    const encryptedPrivateKey = await PasswordManager.encryptBytes({
      bytes: privateKey,
      logger,
      password,
    });
    // act
    const decryptedPrivateKey = await PasswordManager.decryptBytes({
      bytes: encryptedPrivateKey,
      logger,
      password,
    });

    // assert
    expect(encodeHex(decryptedPrivateKey)).toBe(encodeHex(privateKey));
  });
});

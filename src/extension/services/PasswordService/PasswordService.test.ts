import { faker } from '@faker-js/faker';
import { encode as encodeHex } from '@stablelib/hex';
import { generateAccount } from 'algosdk';

// services
import PasswordService from './PasswordService';

// types
import type { ILogger } from '@common/types';

// utils
import createLogger from '@common/utils/createLogger';

describe(PasswordService.name, () => {
  let logger: ILogger;

  beforeAll(() => {
    logger = createLogger('silent');
  });

  it('should encrypt and decrypt a private key', async () => {
    // arrange
    const password = faker.internet.password(10);
    const privateKey = generateAccount().sk;
    const encryptedPrivateKey = await PasswordService.encryptBytes({
      data: privateKey,
      logger,
      password,
    });
    // act
    const decryptedPrivateKey = await PasswordService.decryptBytes({
      data: encryptedPrivateKey,
      logger,
      password,
    });

    // assert
    expect(encodeHex(decryptedPrivateKey)).toBe(encodeHex(privateKey));
  });
});

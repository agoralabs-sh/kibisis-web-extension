import { v4 as uuid } from 'uuid';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// services
import PasswordService from '@extension/services/PasswordService';
import PrivateKeyService from './PrivateKeyService';

// types
import type { IPrivateKey } from '@extension/types';

describe(PrivateKeyService.name, () => {
  const legacyCreatedAt = new Date('2024-07-25').getTime(); // <= v1.17.2
  let password: string;
  let keyPair: Ed21559KeyPair;

  beforeEach(() => {
    keyPair = Ed21559KeyPair.generateFromPrivateKey(
      new Uint8Array([
        133, 59, 225, 210, 192, 174, 46, 88, 148, 71, 152, 110, 196, 157, 235,
        134, 145, 160, 3, 94, 85, 55, 128, 160, 110, 43, 201, 246, 232, 78, 95,
        18,
      ])
    );
    password = 'dxb-kxb_PAD!zmt8pyz';
  });

  describe('upgrade', () => {
    it('should upgrade a legacy private key item (with no version) using password', async () => {
      // arrange
      const encryptedPrivateKey = await PasswordService.encryptBytes({
        data: keyPair.getSecretKey(),
        password,
      });
      const legacyItem: Partial<IPrivateKey> = {
        createdAt: legacyCreatedAt,
        id: uuid(),
        encryptedPrivateKey: PrivateKeyService.encode(encryptedPrivateKey), // pre-v1.18.0 (version 2) used the secret key
        publicKey: PrivateKeyService.encode(keyPair.publicKey),
        updatedAt: legacyCreatedAt,
      };
      let decryptedPrivateKey: Uint8Array;
      let upgradedItem: IPrivateKey;

      // act
      upgradedItem = await PrivateKeyService.upgrade({
        encryptionCredentials: {
          password,
          type: EncryptionMethodEnum.Password,
        },
        privateKeyItem: legacyItem as IPrivateKey,
      });
      decryptedPrivateKey = await PasswordService.decryptBytes({
        data: PrivateKeyService.decode(upgradedItem.encryptedPrivateKey),
        password,
      });

      // assert
      expect(upgradedItem.version).toBe(PrivateKeyService.latestVersion);
      expect(decryptedPrivateKey).toHaveLength(32); // should be a private key (seed) of 32 bytes and not a secret key (private key + public key) of 64 bytes
      expect(PrivateKeyService.encode(decryptedPrivateKey)).toBe(
        PrivateKeyService.encode(keyPair.privateKey)
      );
    });

    it('should upgrade a legacy private key item (with version 0) using password', async () => {
      // arrange
      const encryptedPrivateKey = await PasswordService.encryptBytes({
        data: keyPair.getSecretKey(),
        password,
      });
      const legacyItem: Partial<IPrivateKey> = {
        createdAt: legacyCreatedAt,
        id: uuid(),
        encryptedPrivateKey: PrivateKeyService.encode(encryptedPrivateKey), // pre-v1.18.0 (version 2) used the secret key
        publicKey: PrivateKeyService.encode(keyPair.publicKey),
        updatedAt: legacyCreatedAt,
        version: 0,
      };
      let decryptedPrivateKey: Uint8Array;
      let upgradedItem: IPrivateKey;

      // act
      upgradedItem = await PrivateKeyService.upgrade({
        encryptionCredentials: {
          password,
          type: EncryptionMethodEnum.Password,
        },
        privateKeyItem: legacyItem as IPrivateKey,
      });
      decryptedPrivateKey = await PasswordService.decryptBytes({
        data: PrivateKeyService.decode(upgradedItem.encryptedPrivateKey),
        password,
      });

      // assert
      expect(upgradedItem.version).toBe(PrivateKeyService.latestVersion);
      expect(decryptedPrivateKey).toHaveLength(32); // should be a private key (seed) of 32 bytes and not a secret key (private key + public key) of 64 bytes
      expect(PrivateKeyService.encode(decryptedPrivateKey)).toBe(
        PrivateKeyService.encode(keyPair.privateKey)
      );
    });
  });
});

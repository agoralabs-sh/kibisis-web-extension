import { decodeURLSafe as decodeBase64URLSafe } from '@stablelib/base64';

// enums
import { ARC0300QueryEnum } from '@extension/enums';

// models
import Ed21559KeyPair from '@extension/models/Ed21559KeyPair';

// types
import type { IOptions } from './types';
import type { INewAccount } from '@extension/types';

// utils
import convertPrivateKeyToAVMAddress from '@extension/utils/convertPrivateKeyToAVMAddress';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';

export default function flattenAccountImportSchemaToNewAccounts({
  accounts,
  schemas,
  ...baseOptions
}: IOptions): INewAccount[] {
  return schemas.reduce((acc, schema) => {
    const privateKeys =
      schema.query[ARC0300QueryEnum.PrivateKey].map(decodeBase64URLSafe);
    const addresses = privateKeys.map((value) =>
      convertPrivateKeyToAVMAddress(value, baseOptions)
    );

    return [
      ...acc,
      ...addresses.reduce((acc, address, index) => {
        // if the private key is invalid, or the address already exists, ignore
        if (
          !address ||
          accounts.find(
            (value) => convertPublicKeyToAVMAddress(value.publicKey) === address
          )
        ) {
          return acc;
        }

        return [
          ...acc,
          {
            keyPair: Ed21559KeyPair.generateFromPrivateKey(privateKeys[index]),
            name: schema.query[ARC0300QueryEnum.Name]
              ? schema.query[ARC0300QueryEnum.Name][index]
              : null,
          },
        ];
      }, []),
    ];
  }, []);
}

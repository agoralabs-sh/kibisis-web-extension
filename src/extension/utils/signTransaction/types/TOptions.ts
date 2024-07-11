import type { Transaction } from 'algosdk';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// types
import type { IBaseOptions } from '@common/types';
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

/**
 * @property {IAccountWithExtendedProps[]} accounts - a list of accounts that can sign the transaction.
 * @property {IAccountWithExtendedProps[]} authAccounts - [optional] a list of auth accounts that can sign the transaction for
 * re-keyed accounts.
 * @property {INetwork[]} networks - a list of networks.
 * @property {algosdk.Transaction} unsignedTransaction - the unsigned transaction.
 */
interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  authAccounts: IAccountWithExtendedProps[];
  networks: INetwork[];
  unsignedTransaction: Transaction;
}

type TEncryptionOptions =
  | (IOptions & {
      password: string;
      type: EncryptionMethodEnum.Password;
    })
  | {
      inputKeyMaterial: Uint8Array;
      type: EncryptionMethodEnum.Passkey;
    };

type TOptions = IOptions & TEncryptionOptions;

export default TOptions;

import type { IARC0001Transaction } from '@agoralabs-sh/avm-web-provider';

// enums
import { EncryptionMethodEnum } from '@extension/enums';

// types
import type { IBaseOptions } from '@common/types';
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

/**
 * @property {IAccountWithExtendedProps[]} accounts - the authorized accounts.
 * @property {IAccountWithExtendedProps[]} authAccounts - [optional] a list of auth accounts that can sign the transaction for
 * re-keyed accounts.
 * @property {IARC0001Transaction[]} arc0001Transactions - the transactions to be signed.
 */
interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  arc0001Transactions: IARC0001Transaction[];
  authAccounts: IAccountWithExtendedProps[];
  networks: INetwork[];
}

type TEncryptionOptions =
  | {
      password: string;
      type: EncryptionMethodEnum.Password;
    }
  | {
      inputKeyMaterial: Uint8Array;
      type: EncryptionMethodEnum.Passkey;
    };

type TOptions = IOptions & TEncryptionOptions;

export default TOptions;

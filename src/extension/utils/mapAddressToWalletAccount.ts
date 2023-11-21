import { IWalletAccount } from '@agoralabs-sh/algorand-provider';

// servcies
import { AccountService } from '@extension/services';

// types
import { IAccount, IAccountInformation, INetwork } from '@extension/types';

interface IOptions {
  account: IAccount | null;
  network: INetwork | null;
}

export default function mapAddressToWalletAccount(
  address: string,
  options: IOptions = { account: null, network: null }
): IWalletAccount {
  let accountInformation: IAccountInformation | null = null;

  if (options && options.account && options.network) {
    accountInformation = AccountService.extractAccountInformationForNetwork(
      options.account,
      options.network
    );
  }

  return {
    address,
    name: accountInformation?.name || undefined,
  };
}

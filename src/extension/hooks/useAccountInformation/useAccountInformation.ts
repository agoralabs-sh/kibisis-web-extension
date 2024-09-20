import { useEffect, useState } from 'react';

// selectors
import {
  useSelectAccountById,
  useSelectSettingsSelectedNetwork,
} from '@extension/selectors';

// services
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';

// types
import { IAccount, IAccountInformation, INetwork } from '@extension/types';

export default function useAccountInformation(
  id: string
): IAccountInformation | null {
  const account: IAccount | null = useSelectAccountById(id);
  const selectedNetwork: INetwork | null = useSelectSettingsSelectedNetwork();
  const [accountInformation, setAccountInformation] =
    useState<IAccountInformation | null>(null);

  useEffect(() => {
    let selectedAccountInformation: IAccountInformation | null = null;

    if (account && selectedNetwork) {
      selectedAccountInformation =
        AccountRepositoryService.extractAccountInformationForNetwork(
          account,
          selectedNetwork
        );
    }

    setAccountInformation(selectedAccountInformation);
  }, [account, selectedNetwork]);

  return accountInformation;
}

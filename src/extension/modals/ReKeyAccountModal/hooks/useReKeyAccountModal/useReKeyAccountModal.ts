import { useEffect, useState } from 'react';

// selectors
import {
  useSelectReKeyAccount,
  useSelectReKeyAccountConfirming,
  useSelectSettingsSelectedNetwork,
  useSelectReKeyAccountType,
} from '@extension/selectors';

// repositories
import AccountRepository from '@extension/repositories/AccountRepository';

// types
import type { IAccountInformation } from '@extension/types';
import type { IState } from './types';

export default function useReKeyAccountModal(): IState {
  // selectors
  const account = useSelectReKeyAccount();
  const confirming = useSelectReKeyAccountConfirming();
  const network = useSelectSettingsSelectedNetwork();
  const type = useSelectReKeyAccountType();
  // states
  const [accountInformation, setAccountInformation] =
    useState<IAccountInformation | null>(null);

  useEffect(() => {
    let _accountInformation: IAccountInformation | null = null;

    if (account && network) {
      _accountInformation =
        AccountRepository.extractAccountInformationForNetwork(account, network);
    }

    setAccountInformation(_accountInformation);
  }, [account, network]);

  return {
    account,
    accountInformation,
    confirming,
    network,
    type,
  };
}

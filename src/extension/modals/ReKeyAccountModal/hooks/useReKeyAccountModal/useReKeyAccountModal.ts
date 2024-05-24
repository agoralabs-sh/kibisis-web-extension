import { useEffect, useState } from 'react';

// selectors
import {
  useSelectReKeyAccount,
  useSelectReKeyAccountConfirming,
  useSelectSelectedNetwork,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAccountInformation } from '@extension/types';
import type { IState } from './types';

export default function useReKeyAccountModal(): IState {
  // selectors
  const account = useSelectReKeyAccount();
  const confirming = useSelectReKeyAccountConfirming();
  const network = useSelectSelectedNetwork();
  // states
  const [accountInformation, setAccountInformation] =
    useState<IAccountInformation | null>(null);

  useEffect(() => {
    let _accountInformation: IAccountInformation | null = null;

    if (account && network) {
      _accountInformation = AccountService.extractAccountInformationForNetwork(
        account,
        network
      );
    }

    setAccountInformation(_accountInformation);
  }, [account, network]);

  return {
    account,
    accountInformation,
    confirming,
    network,
  };
}

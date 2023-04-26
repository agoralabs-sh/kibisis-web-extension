import { Algodv2 } from 'algosdk';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// Features
import {
  fetchAccountInformationWithDelay,
  updateAccountInformationThunk,
} from '@extension/features/accounts';

// Selectors
import {
  useSelectAccounts,
  useSelectFetchingAccounts,
  useSelectLogger,
} from '@extension/selectors';

// Types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAlgorandAccountInformation,
  IAppThunkDispatch,
  INode,
} from '@extension/types';
import { IUseAccountOptions, IUseAccountState } from './types';

// Utils
import { randomNode } from '@common/utils';
import {
  initializeDefaultAccount,
  mapAlgorandAccountInformationToAccount,
} from '@extension/utils';

export default function useAccount({
  address,
  network,
}: IUseAccountOptions): IUseAccountState {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const accounts: IAccount[] = useSelectAccounts();
  const fetchingAccounts: boolean = useSelectFetchingAccounts();
  const logger: ILogger = useSelectLogger();
  const [account, setAccount] = useState<IAccount | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let account: IAccount | null =
        accounts.find((value) => value.address === address) || null;
      let accountInformation: IAlgorandAccountInformation;
      let node: INode;

      // if we have this account, use it and update the latest information
      if (account) {
        logger.debug(
          `${useAccount.name}#${useEffect.name}(): found account in storage, updating information`
        );

        setAccount(account);
        dispatch(updateAccountInformationThunk());

        return;
      }

      setFetching(true);

      // fetch the account information of the unknown account
      node = randomNode(network);
      accountInformation = await fetchAccountInformationWithDelay({
        address,
        delay: 0,
        client: new Algodv2('', node.url, node.port),
      });
      account = initializeDefaultAccount({
        address,
        authAddress: accountInformation['auth-addr'],
        genesisHash: network.genesisHash,
      });

      setAccount(
        mapAlgorandAccountInformationToAccount(accountInformation, account)
      );
      setFetching(false);
    })();
  }, []);
  // once the store has been updated with the latest account information, update the account
  useEffect(() => {
    const updatedAccount: IAccount | null =
      accounts.find((value) => value.address === address) || null;

    if (updatedAccount) {
      setAccount(updatedAccount);
    }
  }, [accounts]);
  useEffect(() => setFetching(fetchingAccounts), [fetchingAccounts]);

  return {
    account,
    fetching,
  };
}

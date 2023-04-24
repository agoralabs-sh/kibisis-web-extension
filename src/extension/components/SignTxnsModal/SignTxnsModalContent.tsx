import { encodeAddress, Transaction } from 'algosdk';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import ApplicationTransactionContent from './ApplicationTransactionContent';
import AssetTransferTransactionContent from './AssetTransferTransactionContent';
import MultipleTransactionsContent from './MultipleTransactionsContent';
import PaymentTransactionContent from './PaymentTransactionContent';

// Constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// Features
import { updateAccountInformation } from '@extension/features/accounts';
import { updateAssetInformationThunk } from '@extension/features/assets';

// Selectors
import {
  useSelectAccounts,
  useSelectAssetsByGenesisHash,
  useSelectLogger,
  useSelectUpdatingAccounts,
  useSelectUpdatingAssets,
} from '@extension/selectors';

// Types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAppThunkDispatch,
  IAsset,
  INetwork,
} from '@extension/types';

// Utils
import { initializeDefaultAccount } from '@extension/utils';

interface IProps {
  network: INetwork;
  transactions: Transaction[];
}

const SignTxnsModalContent: FC<IProps> = ({
  network,
  transactions,
}: IProps) => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  const accounts: IAccount[] = useSelectAccounts();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(network.genesisHash);
  const logger: ILogger = useSelectLogger();
  const updatingAccounts: boolean = useSelectUpdatingAccounts();
  const updatingAssets: boolean = useSelectUpdatingAssets();
  const [fetchingAccountInformation, setFetchingAccountInformation] =
    useState<boolean>(false);
  const [fromAccounts, setFromAccounts] = useState<IAccount[]>([]);

  // fetch unknown asset information
  useEffect(() => {
    const unknownAssetIds: string[] = transactions
      .filter((value) => value.type === 'axfer')
      .filter(
        (transaction) =>
          !assets.some((value) => value.id === String(transaction.assetIndex))
      )
      .map((value) => String(value.assetIndex));

    // if we have some unknown assets, update the asset storage
    if (unknownAssetIds.length > 0) {
      dispatch(
        updateAssetInformationThunk({
          ids: unknownAssetIds,
          genesisHash: network.genesisHash,
        })
      );
    }
  }, []);
  // fetch the account information for all from accounts
  useEffect(() => {
    (async () => {
      let updatedFromAccounts: IAccount[];

      setFetchingAccountInformation(true);

      updatedFromAccounts = await Promise.all(
        transactions.map(async (transaction, index) => {
          let address: string = encodeAddress(transaction.from.publicKey);
          let account: IAccount | null =
            accounts.find((value) => value.address === address) || null;

          // if we have this account, just return it
          if (account) {
            return account;
          }

          account = initializeDefaultAccount({
            address,
            genesisHash: network.genesisHash,
          });

          return await updateAccountInformation(account, {
            delay: index * NODE_REQUEST_DELAY,
            logger,
            network,
          });
        })
      );

      setFromAccounts(updatedFromAccounts);
      setFetchingAccountInformation(false);
    })();
  }, []);

  // atomic transfers
  if (transactions.length > 1) {
    return (
      <MultipleTransactionsContent
        fromAccounts={fromAccounts}
        loading={
          fetchingAccountInformation || updatingAccounts || updatingAssets
        }
        nativeCurrency={network.nativeCurrency}
        network={network}
        transactions={transactions}
      />
    );
  }

  // single payment transaction
  if (transactions[0].type === 'pay') {
    return (
      <PaymentTransactionContent
        fromAccount={fromAccounts[0] || null}
        loading={fetchingAccountInformation || updatingAccounts}
        nativeCurrency={network.nativeCurrency}
        transaction={transactions[0]}
      />
    );
  }

  // single asset transfer
  if (transactions[0].type === 'axfer') {
    return (
      <AssetTransferTransactionContent
        asset={
          assets.find(
            (value) => value.id === String(transactions[0].assetIndex)
          ) || null
        }
        fromAccount={fromAccounts[0] || null}
        loading={
          fetchingAccountInformation || updatingAccounts || updatingAssets
        }
        nativeCurrency={network.nativeCurrency}
        network={network}
        transaction={transactions[0]}
      />
    );
  }

  // single app call
  if (transactions[0].type === 'appl') {
    return (
      <ApplicationTransactionContent
        nativeCurrency={network.nativeCurrency}
        network={network}
        transaction={transactions[0]}
      />
    );
  }

  return null;
};

export default SignTxnsModalContent;

import { encode as encodeHex } from '@stablelib/hex';
import { encodeAddress, Transaction } from 'algosdk';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import ApplicationTransactionContent from './ApplicationTransactionContent';
import AssetConfigTransactionContent from './AssetConfigTransactionContent';
import AssetCreateTransactionContent from './AssetCreateTransactionContent';
import AssetFreezeTransactionContent from './AssetFreezeTransactionContent';
import AssetTransferTransactionContent from './AssetTransferTransactionContent';
import KeyRegistrationTransactionContent from './KeyRegistrationTransactionContent';
import MultipleTransactionsContent from './MultipleTransactionsContent';
import PaymentTransactionContent from './PaymentTransactionContent';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// features
import { updateAccountInformation } from '@extension/features/accounts';
import { updateAssetInformationThunk } from '@extension/features/assets';

// selectors
import {
  useSelectAccounts,
  useSelectAssetsByGenesisHash,
  useSelectLogger,
  useSelectPreferredBlockExplorer,
  useSelectUpdatingAssets,
} from '@extension/selectors';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAppThunkDispatch,
  IAsset,
  IExplorer,
  INetwork,
} from '@extension/types';

// utils
import { parseTransactionType } from '@extension/utils';
import { AccountService } from '@extension/services';

interface IProps {
  network: INetwork;
  transactions: Transaction[];
}

const SignTxnsModalContent: FC<IProps> = ({
  network,
  transactions,
}: IProps) => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const assets: IAsset[] = useSelectAssetsByGenesisHash(network.genesisHash);
  const logger: ILogger = useSelectLogger();
  const updatingAssets: boolean = useSelectUpdatingAssets();
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  // state
  const [fetchingAccountInformation, setFetchingAccountInformation] =
    useState<boolean>(false);
  const [fromAccounts, setFromAccounts] = useState<IAccount[]>([]);
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  let singleTransaction: Transaction | null;
  let singleTransactionAsset: IAsset | null;
  let singleTransactionFromAccount: IAccount | null;
  let singleTransactionType: TransactionTypeEnum;

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
          network,
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
          const encodedPublicKey: string = encodeHex(
            transaction.from.publicKey
          );
          let account: IAccount | null =
            accounts.find(
              (value) =>
                value.publicKey.toUpperCase() === encodedPublicKey.toUpperCase()
            ) || null;

          // if we have this account, just return it
          if (account) {
            return account;
          }

          account = AccountService.initializeDefaultAccount({
            publicKey: encodedPublicKey,
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
        explorer={explorer}
        fromAccounts={fromAccounts}
        loadingAccountInformation={fetchingAccountInformation}
        loadingAssetInformation={updatingAssets}
        network={network}
        transactions={transactions}
      />
    );
  }

  singleTransaction = transactions[0];

  if (singleTransaction) {
    singleTransactionAsset =
      assets.find(
        (value) => value.id === String(singleTransaction?.assetIndex)
      ) || null;
    singleTransactionFromAccount = fromAccounts[0] || null;
    singleTransactionType = parseTransactionType(
      singleTransaction.get_obj_for_encoding(),
      {
        network,
        sender: singleTransactionFromAccount,
      }
    );

    switch (singleTransaction.type) {
      case 'acfg':
        if (singleTransactionType === TransactionTypeEnum.AssetCreate) {
          return (
            <AssetCreateTransactionContent
              fromAccount={singleTransactionFromAccount}
              loading={fetchingAccountInformation}
              network={network}
              transaction={singleTransaction}
            />
          );
        }

        return (
          <AssetConfigTransactionContent
            asset={singleTransactionAsset}
            explorer={explorer}
            fromAccount={singleTransactionFromAccount}
            loading={fetchingAccountInformation || updatingAssets}
            network={network}
            transaction={singleTransaction}
          />
        );
      case 'afrz':
        return (
          <AssetFreezeTransactionContent
            asset={singleTransactionAsset}
            explorer={explorer}
            fromAccount={singleTransactionFromAccount}
            loading={fetchingAccountInformation || updatingAssets}
            network={network}
            transaction={singleTransaction}
          />
        );
      case 'appl':
        return (
          <ApplicationTransactionContent
            explorer={explorer}
            network={network}
            transaction={singleTransaction}
          />
        );
      case 'axfer':
        return (
          <AssetTransferTransactionContent
            asset={singleTransactionAsset}
            explorer={explorer}
            fromAccount={singleTransactionFromAccount}
            loading={fetchingAccountInformation || updatingAssets}
            network={network}
            transaction={singleTransaction}
          />
        );
      case 'keyreg':
        return (
          <KeyRegistrationTransactionContent
            fromAccount={singleTransactionFromAccount}
            network={network}
            transaction={singleTransaction}
          />
        );
      case 'pay':
        return (
          <PaymentTransactionContent
            fromAccount={singleTransactionFromAccount}
            loading={fetchingAccountInformation}
            network={network}
            transaction={singleTransaction}
          />
        );
      default:
        break;
    }
  }

  return null;
};

export default SignTxnsModalContent;

import { encode as encodeHex } from '@stablelib/hex';
import { Transaction } from 'algosdk';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// components
import MultipleTransactionsContent from './MultipleTransactionsContent';
import SingleTransactionContent from './SingleTransactionContent';

// constants
import { NODE_REQUEST_DELAY } from '@extension/constants';

// features
import { updateAccountInformation } from '@extension/features/accounts';
import { updateStandardAssetInformationThunk } from '@extension/features/standard-assets';

// selectors
import {
  useSelectAccounts,
  useSelectStandardAssetsByGenesisHash,
  useSelectLogger,
  useSelectPreferredBlockExplorer,
  useSelectUpdatingStandardAssets,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import { ILogger } from '@common/types';
import {
  IAccount,
  IAccountInformation,
  IAppThunkDispatch,
  IStandardAsset,
  IExplorer,
} from '@extension/types';

// utils
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';

interface IProps {
  transactions: Transaction[];
}

const SignTxnsModalContent: FC<IProps> = ({ transactions }: IProps) => {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const logger: ILogger = useSelectLogger();
  const standardAssets: IStandardAsset[] = useSelectStandardAssetsByGenesisHash(
    network.genesisHash
  );
  const updatingStandardAssets: boolean = useSelectUpdatingStandardAssets();
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  // state
  const [fetchingAccountInformation, setFetchingAccountInformation] =
    useState<boolean>(false);
  const [fromAccounts, setFromAccounts] = useState<IAccount[]>([]);
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one

  // fetch unknown asset information
  useEffect(() => {
    const unknownAssetIds: string[] = transactions
      .filter((value) => value.type === 'axfer')
      .filter(
        (transaction) =>
          !standardAssets.some(
            (value) => value.id === String(transaction.assetIndex)
          )
      )
      .map((value) => String(value.assetIndex));

    // if we have some unknown assets, update the asset storage
    if (unknownAssetIds.length > 0) {
      dispatch(
        updateStandardAssetInformationThunk({
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
          let accountInformation: IAccountInformation;
          let encodedGenesisHash: string;

          // if we have this account, just return it
          if (account) {
            return account;
          }

          account = AccountService.initializeDefaultAccount({
            publicKey: encodedPublicKey,
          });
          encodedGenesisHash = convertGenesisHashToHex(
            network.genesisHash
          ).toUpperCase();
          accountInformation = await updateAccountInformation({
            address:
              AccountService.convertPublicKeyToAlgorandAddress(
                encodedPublicKey
              ),
            currentAccountInformation:
              account.networkInformation[encodedGenesisHash] ||
              AccountService.initializeDefaultAccountInformation(),
            delay: index * NODE_REQUEST_DELAY,
            logger,
            network,
          });

          return {
            ...account,
            networkInformation: {
              ...account.networkInformation,
              [convertGenesisHashToHex(network.genesisHash).toUpperCase()]:
                accountInformation,
            },
          };
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
        loadingAssetInformation={updatingStandardAssets}
        network={network}
        transactions={transactions}
      />
    );
  }

  return <SingleTransactionContent transaction={transactions[0]} />;
};

export default SignTxnsModalContent;

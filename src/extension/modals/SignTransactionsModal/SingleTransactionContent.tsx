import { encode as encodeBase64 } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { Transaction, encodeAddress } from 'algosdk';
import React, { FC, useEffect, useState } from 'react';

// components
import KeyRegistrationTransactionModalContent from '@extension/components/KeyRegistrationTransactionModalContent';
import ApplicationTransactionContent from './ApplicationTransactionContent';
import AssetConfigTransactionContent from './AssetConfigTransactionContent';
import AssetCreateTransactionContent from './AssetCreateTransactionContent';
import AssetFreezeTransactionContent from './AssetFreezeTransactionContent';
import AssetTransferTransactionContent from './AssetTransferTransactionContent';
import PaymentTransactionContent from './PaymentTransactionContent';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectNetworkByGenesisHash,
  useSelectSettingsPreferredBlockExplorer,
  useSelectStandardAssetsByGenesisHash,
  useSelectStandardAssetsUpdating,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { IAccount, IAccountInformation } from '@extension/types';

// utils
import parseTransactionType from '@extension/utils/parseTransactionType';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import updateAccountInformation from '@extension/utils/updateAccountInformation';

interface IProps {
  transaction: Transaction;
}

const SingleTransactionContent: FC<IProps> = ({ transaction }: IProps) => {
  const encodedGenesisHash: string = encodeBase64(transaction.genesisHash);
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const logger = useSelectLogger();
  const network = useSelectNetworkByGenesisHash(encodedGenesisHash);
  const preferredExplorer = useSelectSettingsPreferredBlockExplorer();
  const standardAssets =
    useSelectStandardAssetsByGenesisHash(encodedGenesisHash);
  const updatingStandardAssets = useSelectStandardAssetsUpdating();
  // states
  const [fetchingAccountInformation, setFetchingAccountInformation] =
    useState<boolean>(false);
  const [fromAccount, setFromAccount] = useState<IAccount | null>(null);
  // misc
  const explorer =
    network?.blockExplorers.find(
      (value) => value.id === preferredExplorer?.id
    ) ||
    network?.blockExplorers[0] ||
    null; // get the preferred explorer, if it exists in the network, otherwise get the default one
  const standardAsset =
    standardAssets.find(
      (value) => value.id === String(transaction?.assetIndex)
    ) || null;
  const transactionType = parseTransactionType(
    transaction.get_obj_for_encoding(),
    {
      network,
      sender: fromAccount,
    }
  );

  // fetch account information for the from account
  useEffect(() => {
    (async () => {
      const _functionName: string = 'useEffect';
      const encodedPublicKey: string = encodeHex(transaction.from.publicKey);
      let account: IAccount | null =
        accounts.find(
          (value) =>
            value.publicKey.toUpperCase() === encodedPublicKey.toUpperCase()
        ) || null;
      let accountInformation: IAccountInformation;
      let encodedGenesisHash: string;

      // if we have this account, use it
      if (account) {
        setFromAccount(account);

        return;
      }

      if (!network) {
        logger.debug(
          `${SingleTransactionContent.name}#${_functionName}: unable to find network for genesis id "${transaction.genesisID}"`
        );

        return;
      }

      setFetchingAccountInformation(true);

      account = AccountService.initializeDefaultAccount({
        publicKey: encodedPublicKey,
      });
      encodedGenesisHash = convertGenesisHashToHex(
        network.genesisHash
      ).toUpperCase();
      accountInformation = await updateAccountInformation({
        address:
          AccountService.convertPublicKeyToAlgorandAddress(encodedPublicKey),
        currentAccountInformation:
          account.networkInformation[encodedGenesisHash] ||
          AccountService.initializeDefaultAccountInformation(),
        logger,
        network,
      });

      setFromAccount({
        ...account,
        networkInformation: {
          ...account.networkInformation,
          [encodedGenesisHash]: accountInformation,
        },
      });
      setFetchingAccountInformation(false);
    })();
  }, []);

  if (!network) {
    logger.debug(
      `${SingleTransactionContent.name}: failed to get network for genesis hash "${encodedGenesisHash}"`
    );

    return null;
  }

  if (!fromAccount) {
    logger.debug(
      `${
        SingleTransactionContent.name
      }: from account not known "${encodeAddress(transaction.from.publicKey)}"`
    );

    return null;
  }

  switch (transaction.type) {
    case 'acfg':
      if (transactionType === TransactionTypeEnum.AssetCreate) {
        return (
          <AssetCreateTransactionContent
            fromAccount={fromAccount}
            loading={fetchingAccountInformation}
            network={network}
            transaction={transaction}
          />
        );
      }

      return (
        <AssetConfigTransactionContent
          asset={standardAsset}
          explorer={explorer}
          fromAccount={fromAccount}
          loading={fetchingAccountInformation || updatingStandardAssets}
          network={network}
          transaction={transaction}
        />
      );
    case 'afrz':
      return (
        <AssetFreezeTransactionContent
          asset={standardAsset}
          explorer={explorer}
          fromAccount={fromAccount}
          loading={fetchingAccountInformation || updatingStandardAssets}
          network={network}
          transaction={transaction}
        />
      );
    case 'appl':
      return (
        <ApplicationTransactionContent
          explorer={explorer}
          network={network}
          transaction={transaction}
        />
      );
    case 'axfer':
      return (
        <AssetTransferTransactionContent
          asset={standardAsset}
          explorer={explorer}
          fromAccount={fromAccount}
          loading={fetchingAccountInformation || updatingStandardAssets}
          network={network}
          transaction={transaction}
        />
      );
    case 'keyreg':
      return (
        <KeyRegistrationTransactionModalContent
          account={fromAccount}
          network={network}
          showHeader={true}
          transaction={transaction}
        />
      );
    case 'pay':
      return (
        <PaymentTransactionContent
          fromAccount={fromAccount}
          loading={fetchingAccountInformation}
          network={network}
          transaction={transaction}
        />
      );
    default:
      return null;
  }
};

export default SingleTransactionContent;

import { Box, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { Transaction, TransactionType } from 'algosdk';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import NetworkBadge from '@extension/components/NetworkBadge';
import KeyRegistrationTransactionModalBody from '@extension/components/KeyRegistrationTransactionModalBody';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import ApplicationTransactionContent from './ApplicationTransactionContent';
import AssetConfigTransactionContent from './AssetConfigTransactionContent';
import AssetCreateTransactionContent from './AssetCreateTransactionContent';
import AssetFreezeTransactionContent from './AssetFreezeTransactionContent';
import AssetTransferTransactionContent from './AssetTransferTransactionContent';
import PaymentTransactionContent from './PaymentTransactionContent';

// constants
import { DEFAULT_GAP, NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectNetworkByGenesisHash,
  useSelectSettings,
  useSelectSettingsPreferredBlockExplorer,
  useSelectStandardAssetsByGenesisHash,
  useSelectStandardAssetsUpdating,
} from '@extension/selectors';

// services
import AccountRepositoryService from '@extension/repositories/AccountRepositoryService';
import PrivateKeyService from '@extension/services/PrivateKeyService';

// types
import type {
  IAccountInformation,
  IAccountWithExtendedProps,
  IStandardAsset,
} from '@extension/types';
import type { IAtomicTransactionsContentProps } from './types';

// utils
import computeGroupId from '@common/utils/computeGroupId';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import convertPublicKeyToAVMAddress from '@extension/utils/convertPublicKeyToAVMAddress';
import parseTransactionType from '@extension/utils/parseTransactionType';
import selectNodeIDByGenesisHashFromSettings from '@extension/utils/selectNodeIDByGenesisHashFromSettings';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';
import updateAccountInformation from '@extension/utils/updateAccountInformation';

const AtomicTransactionsContent: FC<IAtomicTransactionsContentProps> = ({
  transactions,
}) => {
  const { t } = useTranslation();
  const genesisHash =
    uniqueGenesisHashesFromTransactions(transactions).pop() || '';
  const encodedGenesisHash = convertGenesisHashToHex(genesisHash).toUpperCase();
  // selectors
  const accounts = useSelectAccounts();
  const logger = useSelectLogger();
  const network = useSelectNetworkByGenesisHash(genesisHash);
  const preferredExplorer = useSelectSettingsPreferredBlockExplorer();
  const settings = useSelectSettings();
  const standardAssets = useSelectStandardAssetsByGenesisHash(genesisHash);
  const updatingStandardAssets = useSelectStandardAssetsUpdating();
  // hooks
  const borderColor = useBorderColor();
  // state
  const [fetchingAccountInformation, setFetchingAccountInformation] =
    useState<boolean>(false);
  const [fromAccounts, setFromAccounts] = useState<IAccountWithExtendedProps[]>(
    []
  );
  const [openAccordions, setOpenAccordions] = useState<boolean[]>(
    Array.from({ length: transactions.length }, () => false)
  );
  // misc
  const blockExplorer =
    network?.blockExplorers.find(
      (value) => value.id === preferredExplorer?.id
    ) ||
    network?.blockExplorers[0] ||
    null; // get the preferred explorer, if it exists in the network, otherwise get the default one
  const computedGroupId = encodeBase64(computeGroupId(transactions));
  // handlers
  const handleToggleAccordion = (accordionIndex: number) => (open: boolean) => {
    setOpenAccordions(
      openAccordions.map((value, index) =>
        index === accordionIndex ? open : value
      )
    );
  };
  // renders
  const renderTransaction = (
    transaction: Transaction,
    transactionIndex: number
  ) => {
    const fromAccount = fromAccounts[transactionIndex] || null;
    let standardAsset: IStandardAsset | null;
    let transactionType: TransactionTypeEnum;

    if (!network || !fromAccount) {
      return;
    }

    standardAsset =
      standardAssets.find(
        (value) => value.id === String(transaction.assetIndex)
      ) || null;
    transactionType = parseTransactionType(transaction.get_obj_for_encoding(), {
      network,
      sender: fromAccount,
    });

    switch (transaction.type) {
      case TransactionType.acfg:
        if (transactionType === TransactionTypeEnum.AssetCreate) {
          return (
            <AssetCreateTransactionContent
              accounts={accounts}
              blockExplorer={blockExplorer}
              condensed={{
                expanded: openAccordions[transactionIndex],
                onChange: handleToggleAccordion(transactionIndex),
              }}
              fromAccount={fromAccount}
              hideNetwork={true}
              loading={fetchingAccountInformation}
              network={network}
              transaction={transaction}
            />
          );
        }

        return (
          <AssetConfigTransactionContent
            accounts={accounts}
            asset={standardAsset}
            blockExplorer={blockExplorer}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            fromAccount={fromAccount}
            hideNetwork={true}
            loading={fetchingAccountInformation || updatingStandardAssets}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionType.afrz:
        return (
          <AssetFreezeTransactionContent
            accounts={accounts}
            asset={standardAsset}
            blockExplorer={blockExplorer}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            fromAccount={fromAccount}
            hideNetwork={true}
            loading={fetchingAccountInformation || updatingStandardAssets}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionType.appl:
        return (
          <ApplicationTransactionContent
            accounts={accounts}
            blockExplorer={blockExplorer}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            fromAccount={fromAccount}
            hideNetwork={true}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionType.axfer:
        return (
          <AssetTransferTransactionContent
            accounts={accounts}
            asset={standardAsset}
            blockExplorer={blockExplorer}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            fromAccount={fromAccount}
            hideNetwork={true}
            loading={fetchingAccountInformation || updatingStandardAssets}
            network={network}
            transaction={transaction}
          />
        );
      case TransactionType.keyreg:
        return (
          <KeyRegistrationTransactionModalBody
            account={fromAccount}
            accounts={accounts}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            hideNetwork={true}
            network={network}
            showHeader={true}
            transaction={transaction}
          />
        );
      case TransactionType.pay:
        return (
          <PaymentTransactionContent
            accounts={accounts}
            blockExplorer={blockExplorer}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            fromAccount={fromAccount}
            hideNetwork={true}
            loading={fetchingAccountInformation}
            network={network}
            transaction={transaction}
          />
        );
      default:
        break;
    }

    return null;
  };

  // fetch the account information for all from accounts
  useEffect(() => {
    (async () => {
      const _functionName = 'useEffect';
      let updatedFromAccounts: IAccountWithExtendedProps[];

      if (!network) {
        logger.debug(
          `${AtomicTransactionsContent.name}#${_functionName}: unable to find network for genesis hash "${genesisHash}"`
        );

        return;
      }

      setFetchingAccountInformation(true);

      updatedFromAccounts = await Promise.all(
        transactions.map(async (transaction, index) => {
          const encodedPublicKey: string = encodeHex(
            transaction.from.publicKey
          );
          let account: IAccountWithExtendedProps | null =
            accounts.find(
              (value) =>
                value.publicKey.toUpperCase() === encodedPublicKey.toUpperCase()
            ) || null;
          let accountInformation: IAccountInformation;

          // if we have this account, just return it
          if (account) {
            return account;
          }

          account = {
            ...AccountRepositoryService.initializeDefaultAccount({
              publicKey: encodedPublicKey,
            }),
            watchAccount: true,
          };
          accountInformation = await updateAccountInformation({
            address: convertPublicKeyToAVMAddress(
              PrivateKeyService.decode(encodedPublicKey)
            ),
            currentAccountInformation:
              account.networkInformation[encodedGenesisHash] ||
              AccountRepositoryService.initializeDefaultAccountInformation(),
            delay: index * NODE_REQUEST_DELAY,
            logger,
            network,
            nodeID: selectNodeIDByGenesisHashFromSettings({
              genesisHash: network.genesisHash,
              settings,
            }),
          });

          return {
            ...account,
            networkInformation: {
              ...account.networkInformation,
              [encodedGenesisHash]: accountInformation,
            },
          };
        })
      );

      setFromAccounts(updatedFromAccounts);
      setFetchingAccountInformation(false);
    })();
  }, []);

  return (
    <VStack spacing={DEFAULT_GAP - 2} w="full">
      {/*group id*/}
      <ModalTextItem
        label={`${t<string>('labels.groupId')}:`}
        value={computedGroupId}
      />

      {/*network*/}
      {network && (
        <ModalItem
          label={t<string>('labels.network')}
          value={<NetworkBadge network={network} size="xs" />}
        />
      )}

      {/*transactions*/}
      {transactions.map((transaction, index) => (
        <Box
          borderColor={borderColor}
          borderRadius="md"
          borderStyle="solid"
          borderWidth={1}
          key={`sign-transactions-modal-atomic-transactions-item-${index}`}
          px={DEFAULT_GAP - 2}
          py={DEFAULT_GAP / 3}
          w="full"
        >
          <VStack
            alignItems="center"
            justifyContent="flex-start"
            spacing={DEFAULT_GAP / 3}
            w="full"
          >
            {renderTransaction(transaction, index)}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};

export default AtomicTransactionsContent;

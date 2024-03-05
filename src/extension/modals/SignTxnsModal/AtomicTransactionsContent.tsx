import { Box, VStack } from '@chakra-ui/react';
import { encode as encodeBase64 } from '@stablelib/base64';
import { encode as encodeHex } from '@stablelib/hex';
import { Transaction } from 'algosdk';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// components
import ChainBadge from '@extension/components/ChainBadge';
import ModalItem from '@extension/components/ModalItem';
import ModalTextItem from '@extension/components/ModalTextItem';
import ApplicationTransactionContent from './ApplicationTransactionContent';
import AssetConfigTransactionContent from './AssetConfigTransactionContent';
import AssetCreateTransactionContent from './AssetCreateTransactionContent';
import AssetFreezeTransactionContent from './AssetFreezeTransactionContent';
import AssetTransferTransactionContent from './AssetTransferTransactionContent';
import KeyRegistrationTransactionContent from './KeyRegistrationTransactionContent';
import PaymentTransactionContent from './PaymentTransactionContent';

// constants
import { DEFAULT_GAP, NODE_REQUEST_DELAY } from '@extension/constants';

// enums
import { TransactionTypeEnum } from '@extension/enums';

// features
import { updateAccountInformation } from '@extension/features/accounts';

// hooks
import useBorderColor from '@extension/hooks/useBorderColor';

// selectors
import {
  useSelectAccounts,
  useSelectLogger,
  useSelectNetworks,
  useSelectPreferredBlockExplorer,
  useSelectStandardAssetsByGenesisHash,
  useSelectUpdatingStandardAssets,
} from '@extension/selectors';

// services
import AccountService from '@extension/services/AccountService';

// types
import type { ILogger } from '@common/types';
import type {
  IAccount,
  IAccountInformation,
  IBlockExplorer,
  INetwork,
  IStandardAsset,
} from '@extension/types';

// utils
import computeGroupId from '@common/utils/computeGroupId';
import convertGenesisHashToHex from '@extension/utils/convertGenesisHashToHex';
import parseTransactionType from '@extension/utils/parseTransactionType';
import uniqueGenesisHashesFromTransactions from '@extension/utils/uniqueGenesisHashesFromTransactions';

interface IProps {
  transactions: Transaction[];
}

const AtomicTransactionsContent: FC<IProps> = ({ transactions }: IProps) => {
  const { t } = useTranslation();
  const genesisHash: string =
    uniqueGenesisHashesFromTransactions(transactions).pop() || '';
  const encodedGenesisHash: string =
    convertGenesisHashToHex(genesisHash).toUpperCase();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const logger: ILogger = useSelectLogger();
  const networks: INetwork[] = useSelectNetworks();
  const preferredExplorer: IBlockExplorer | null =
    useSelectPreferredBlockExplorer();
  const standardAssets: IStandardAsset[] =
    useSelectStandardAssetsByGenesisHash(genesisHash);
  const updatingStandardAssets: boolean = useSelectUpdatingStandardAssets();
  // hooks
  const borderColor: string = useBorderColor();
  // state
  const [fetchingAccountInformation, setFetchingAccountInformation] =
    useState<boolean>(false);
  const [fromAccounts, setFromAccounts] = useState<IAccount[]>([]);
  const [openAccordions, setOpenAccordions] = useState<boolean[]>(
    Array.from({ length: transactions.length }, () => false)
  );
  // misc
  const computedGroupId: string = encodeBase64(computeGroupId(transactions));
  const network: INetwork | null =
    networks.find((value) => value.genesisHash === genesisHash) || null;
  const explorer: IBlockExplorer | null =
    network?.blockExplorers.find(
      (value) => value.id === preferredExplorer?.id
    ) ||
    network?.blockExplorers[0] ||
    null; // get the preferred explorer, if it exists in the network, otherwise get the default one
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
    let standardAsset: IStandardAsset | null;
    let transactionType: TransactionTypeEnum;

    if (!network) {
      return;
    }

    standardAsset =
      standardAssets.find(
        (value) => value.id === String(transaction.assetIndex)
      ) || null;
    transactionType = parseTransactionType(transaction.get_obj_for_encoding(), {
      network,
      sender: fromAccounts[transactionIndex] || null,
    });

    switch (transaction.type) {
      case 'acfg':
        if (transactionType === TransactionTypeEnum.AssetCreate) {
          return (
            <AssetCreateTransactionContent
              condensed={{
                expanded: openAccordions[transactionIndex],
                onChange: handleToggleAccordion(transactionIndex),
              }}
              fromAccount={fromAccounts[transactionIndex] || null}
              loading={fetchingAccountInformation}
              network={network}
              transaction={transaction}
            />
          );
        }

        return (
          <AssetConfigTransactionContent
            asset={standardAsset}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            explorer={explorer}
            fromAccount={fromAccounts[transactionIndex] || null}
            loading={fetchingAccountInformation || updatingStandardAssets}
            network={network}
            transaction={transaction}
          />
        );
      case 'afrz':
        return (
          <AssetFreezeTransactionContent
            asset={standardAsset}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            explorer={explorer}
            fromAccount={fromAccounts[transactionIndex] || null}
            loading={fetchingAccountInformation || updatingStandardAssets}
            network={network}
            transaction={transaction}
          />
        );
      case 'appl':
        return (
          <ApplicationTransactionContent
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            explorer={explorer}
            network={network}
            transaction={transaction}
          />
        );
      case 'axfer':
        return (
          <AssetTransferTransactionContent
            asset={standardAsset}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            explorer={explorer}
            fromAccount={fromAccounts[transactionIndex] || null}
            loading={fetchingAccountInformation || updatingStandardAssets}
            network={network}
            transaction={transaction}
          />
        );
      case 'keyreg':
        return (
          <KeyRegistrationTransactionContent
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
            fromAccount={fromAccounts[transactionIndex] || null}
            network={network}
            transaction={transaction}
          />
        );
      case 'pay':
        return (
          <PaymentTransactionContent
            fromAccount={fromAccounts[transactionIndex] || null}
            condensed={{
              expanded: openAccordions[transactionIndex],
              onChange: handleToggleAccordion(transactionIndex),
            }}
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
      const _functionName: string = 'useEffect';
      let updatedFromAccounts: IAccount[];

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
          let account: IAccount | null =
            accounts.find(
              (value) =>
                value.publicKey.toUpperCase() === encodedPublicKey.toUpperCase()
            ) || null;
          let accountInformation: IAccountInformation;

          // if we have this account, just return it
          if (account) {
            return account;
          }

          account = AccountService.initializeDefaultAccount({
            publicKey: encodedPublicKey,
          });
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
    <VStack spacing={4} w="full">
      {/*group id*/}
      <ModalTextItem
        label={`${t<string>('labels.groupId')}:`}
        value={computedGroupId}
      />

      {/*network*/}
      {network && (
        <ModalItem
          label={t<string>('labels.network')}
          value={<ChainBadge network={network} />}
        />
      )}

      {/*transactions*/}
      {transactions.map((transaction, index) => (
        <Box
          borderColor={borderColor}
          borderRadius="md"
          borderStyle="solid"
          borderWidth={1}
          key={`sign-txns-modal-atomic-transactions-item-${index}`}
          px={DEFAULT_GAP - 2}
          py={DEFAULT_GAP / 3}
          w="full"
        >
          <VStack
            alignItems="center"
            justifyContent="flex-start"
            spacing={2}
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

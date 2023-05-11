import {
  Code,
  HStack,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import TransactionItem from './TransactionItem';

// Constants
import { ITEM_HEIGHT } from './constants';

// Hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// Selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// Services
import { AccountService } from '@extension/services';

// Types
import {
  IAccount,
  IExplorer,
  INetwork,
  IPaymentTransaction,
} from '@extension/types';

// Utils
import { createIconFromDataUri, ellipseAddress } from '@extension/utils';
import CopyIconButton from '@extension/components/CopyIconButton';

interface IProps {
  account: IAccount;
  network: INetwork;
  transaction: IPaymentTransaction;
}

const PaymentTransactionContent: FC<IProps> = ({
  account,
  network,
  transaction,
}: IProps) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // selectors
  const accounts: IAccount[] = useSelectAccounts();
  const preferredExplorer: IExplorer | null = useSelectPreferredBlockExplorer();
  // hooks
  const defaultTextColor: string = useDefaultTextColor();
  const subTextColor: string = useSubTextColor();
  // misc
  const accountAddress: string =
    AccountService.convertPublicKeyToAlgorandAddress(account.publicKey);
  const amount: BigNumber = new BigNumber(transaction.amount);
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  const isReceiverKnown: boolean =
    accounts.findIndex(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        transaction.receiver
    ) > -1;
  const isSenderKnown: boolean =
    accounts.findIndex(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        transaction.sender
    ) > -1;
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();

  return (
    <>
      {/*amount*/}
      <TransactionItem label={t<string>('labels.amount')}>
        <AssetDisplay
          atomicUnitAmount={amount}
          color={
            amount.lte(0)
              ? defaultTextColor
              : transaction.receiver === accountAddress
              ? 'green.500'
              : 'red.500'
          }
          decimals={network.nativeCurrency.decimals}
          fontSize="sm"
          icon={createIconFromDataUri(network.nativeCurrency.iconUri, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          prefix={
            amount.lte(0)
              ? undefined
              : transaction.receiver === accountAddress
              ? '+'
              : '-'
          }
          unit={network.nativeCurrency.code}
        />
      </TransactionItem>

      {/*from*/}
      <TransactionItem label={t<string>('labels.from')}>
        <HStack spacing={0}>
          <AddressDisplay
            address={transaction.sender}
            ariaLabel="From address"
            color={subTextColor}
            fontSize="sm"
            network={network}
          />

          {/*open in explorer button*/}
          {!isSenderKnown && explorer && (
            <OpenTabIconButton
              size="sm"
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.sender}`}
            />
          )}
        </HStack>
      </TransactionItem>

      {/*to*/}
      <TransactionItem label={t<string>('labels.to')}>
        <HStack spacing={0}>
          <AddressDisplay
            address={transaction.receiver}
            ariaLabel="From address"
            color={subTextColor}
            fontSize="sm"
            network={network}
          />

          {/*open in explorer button*/}
          {!isReceiverKnown && explorer && (
            <OpenTabIconButton
              size="sm"
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.receiver}`}
            />
          )}
        </HStack>
      </TransactionItem>

      {/*fee*/}
      <TransactionItem label={t<string>('labels.fee')}>
        <AssetDisplay
          atomicUnitAmount={new BigNumber(transaction.fee)}
          color="red.500"
          decimals={network.nativeCurrency.decimals}
          fontSize="sm"
          icon={createIconFromDataUri(network.nativeCurrency.iconUri, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          prefix="-"
          unit={network.nativeCurrency.code}
        />
      </TransactionItem>

      {/*completed date*/}
      {transaction.completedAt && (
        <TransactionItem label={t<string>('labels.date')}>
          <Text color={subTextColor} fontSize="sm">
            {new Date(transaction.completedAt).toLocaleString()}
          </Text>
        </TransactionItem>
      )}

      {/*note*/}
      {transaction.note && (
        <TransactionItem label={t<string>('labels.note')}>
          <Code
            borderRadius="md"
            color={defaultTextColor}
            fontSize="sm"
            wordBreak="break-word"
          >
            {transaction.note}
          </Code>
        </TransactionItem>
      )}

      <MoreInformationAccordion
        color={defaultTextColor}
        fontSize="sm"
        isOpen={isOpen}
        minButtonHeight={ITEM_HEIGHT}
        onChange={handleMoreInformationToggle}
      >
        <VStack spacing={4} w="full">
          {/*id*/}
          <TransactionItem label={t<string>('labels.id')}>
            {transaction.id ? (
              <HStack spacing={0}>
                <Tooltip
                  aria-label="The ID of the transaction"
                  label={transaction.id}
                >
                  <Text color={subTextColor} fontSize="sm">
                    {ellipseAddress(transaction.id, {
                      end: 10,
                      start: 10,
                    })}
                  </Text>
                </Tooltip>
                <CopyIconButton
                  ariaLabel="Copy transaction ID"
                  copiedTooltipLabel={t<string>('captions.transactionIdCopied')}
                  size="sm"
                  value={transaction.id}
                />
                {explorer && (
                  <OpenTabIconButton
                    size="sm"
                    tooltipLabel={t<string>('captions.openOn', {
                      name: explorer.canonicalName,
                    })}
                    url={`${explorer.baseUrl}${explorer.transactionPath}/${transaction.id}`}
                  />
                )}
              </HStack>
            ) : (
              <Text color={subTextColor} fontSize="sm">
                {'-'}
              </Text>
            )}
          </TransactionItem>

          {/*group id*/}
          {transaction.groupId && (
            <TransactionItem label={t<string>('labels.groupId')}>
              <HStack spacing={0}>
                <Tooltip
                  aria-label="The group ID of the transaction"
                  label={transaction.groupId}
                >
                  <Text color={subTextColor} fontSize="sm">
                    {ellipseAddress(transaction.groupId, {
                      end: 10,
                      start: 10,
                    })}
                  </Text>
                </Tooltip>
                <CopyIconButton
                  ariaLabel="Copy group ID"
                  copiedTooltipLabel={t<string>('captions.groupIdCopied')}
                  size="sm"
                  value={transaction.groupId}
                />
                {explorer && explorer.groupPath && (
                  <OpenTabIconButton
                    size="sm"
                    tooltipLabel={t<string>('captions.openOn', {
                      name: explorer.canonicalName,
                    })}
                    url={`${explorer.baseUrl}${
                      explorer.groupPath
                    }/${encodeURIComponent(transaction.groupId)}`}
                  />
                )}
              </HStack>
            </TransactionItem>
          )}
        </VStack>
      </MoreInformationAccordion>
    </>
  );
};

export default PaymentTransactionContent;

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
import AssetAvatar from '@extension/components/AssetAvatar';
import AssetIcon from '@extension/components/AssetIcon';
import CopyIconButton from '@extension/components/CopyIconButton';
import LoadingTransactionContent from '@extension/pages/TransactionPage/LoadingTransactionContent';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import TransactionPageItem from './TransactionPageItem';

// Constants
import { ITEM_HEIGHT } from './constants';

// Hooks
import useAsset from '@extension/hooks/useAsset';
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import usePrimaryButtonTextColor from '@extension/hooks/usePrimaryButtonTextColor';
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
  IAsset,
  IAssetTransferTransaction,
  IExplorer,
  INetwork,
} from '@extension/types';

// Utils
import { createIconFromDataUri, ellipseAddress } from '@extension/utils';

interface IProps {
  account: IAccount;
  network: INetwork;
  transaction: IAssetTransferTransaction;
}

const AssetTransferTransactionContent: FC<IProps> = ({
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
  const { asset, updating } = useAsset(transaction.assetId);
  const defaultTextColor: string = useDefaultTextColor();
  const primaryButtonTextColor: string = usePrimaryButtonTextColor();
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

  if (!asset || updating) {
    return <LoadingTransactionContent />;
  }

  return (
    <>
      {/*amount*/}
      <TransactionPageItem label={t<string>('labels.amount')}>
        <AssetDisplay
          amountColor={
            amount.lte(0)
              ? defaultTextColor
              : transaction.receiver === accountAddress
              ? 'green.500'
              : 'red.500'
          }
          atomicUnitAmount={amount}
          decimals={asset.decimals}
          displayUnit={true}
          displayUnitColor={subTextColor}
          fontSize="sm"
          icon={
            <AssetAvatar
              asset={asset}
              fallbackIcon={
                <AssetIcon
                  color={primaryButtonTextColor}
                  networkTheme={network.chakraTheme}
                  h={3}
                  w={3}
                />
              }
              size="2xs"
            />
          }
          prefix={
            amount.lte(0)
              ? undefined
              : transaction.receiver === accountAddress
              ? '+'
              : '-'
          }
          unit={asset.unitName || undefined}
        />
      </TransactionPageItem>

      {/*from*/}
      <TransactionPageItem label={t<string>('labels.from')}>
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
      </TransactionPageItem>

      {/*to*/}
      <TransactionPageItem label={t<string>('labels.to')}>
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
      </TransactionPageItem>

      {/*fee*/}
      <TransactionPageItem label={t<string>('labels.fee')}>
        <AssetDisplay
          atomicUnitAmount={new BigNumber(transaction.fee)}
          amountColor="red.500"
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
      </TransactionPageItem>

      {/*completed date*/}
      {transaction.completedAt && (
        <TransactionPageItem label={t<string>('labels.date')}>
          <Text color={subTextColor} fontSize="sm">
            {new Date(transaction.completedAt).toLocaleString()}
          </Text>
        </TransactionPageItem>
      )}

      {/*note*/}
      {transaction.note && (
        <TransactionPageItem label={t<string>('labels.note')}>
          <Code
            borderRadius="md"
            color={defaultTextColor}
            fontSize="sm"
            wordBreak="break-word"
          >
            {transaction.note}
          </Code>
        </TransactionPageItem>
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
          <TransactionPageItem label={t<string>('labels.id')}>
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
          </TransactionPageItem>

          {/*group id*/}
          {transaction.groupId && (
            <TransactionPageItem label={t<string>('labels.groupId')}>
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
            </TransactionPageItem>
          )}

          {/*asset id*/}
          <TransactionPageItem label={t<string>('labels.assetId')}>
            <HStack spacing={0}>
              <Text color={subTextColor} fontSize="sm">
                {asset.id}
              </Text>
              <CopyIconButton
                ariaLabel="Copy asset ID"
                copiedTooltipLabel={t<string>('captions.assetIdCopied')}
                size="sm"
                value={asset.id}
              />
              {explorer && (
                <OpenTabIconButton
                  size="sm"
                  tooltipLabel={t<string>('captions.openOn', {
                    name: explorer.canonicalName,
                  })}
                  url={`${explorer.baseUrl}${explorer.assetPath}/${asset.id}`}
                />
              )}
            </HStack>
          </TransactionPageItem>
        </VStack>
      </MoreInformationAccordion>
    </>
  );
};

export default AssetTransferTransactionContent;

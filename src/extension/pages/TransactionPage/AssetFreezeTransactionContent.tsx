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
import PageItem, { ITEM_HEIGHT } from '@extension/components/PageItem';

// Constants
import { DEFAULT_GAP } from '@extension/constants';

// Enums
import { TransactionTypeEnum } from '@extension/enums';

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
  IAssetFreezeTransaction,
  IAssetUnfreezeTransaction,
  IExplorer,
  INetwork,
} from '@extension/types';

// Utils
import { createIconFromDataUri, ellipseAddress } from '@extension/utils';

interface IProps {
  network: INetwork;
  transaction: IAssetFreezeTransaction | IAssetUnfreezeTransaction;
}

const AssetTransferTransactionContent: FC<IProps> = ({
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
  const subTextColor: string = useSubTextColor();
  // misc
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  const isFrozenKnown: boolean =
    accounts.findIndex(
      (value) =>
        AccountService.convertPublicKeyToAlgorandAddress(value.publicKey) ===
        transaction.frozenAddress
    ) > -1;
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();

  if (!asset || updating) {
    return <LoadingTransactionContent />;
  }

  return (
    <VStack
      alignItems="flex-start"
      justifyContent="flex-start"
      px={DEFAULT_GAP}
      spacing={4}
      w="full"
    >
      {/*asset id*/}
      <PageItem fontSize="sm" label={t<string>('labels.assetId')}>
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
      </PageItem>

      {/*frozen account*/}
      <PageItem
        fontSize="sm"
        label={t<string>(
          transaction.type === TransactionTypeEnum.AssetFreeze
            ? 'labels.accountToFreeze'
            : 'labels.accountToUnfreeze'
        )}
      >
        <HStack spacing={0}>
          <AddressDisplay
            address={transaction.frozenAddress}
            ariaLabel="Address to freeze/unfreeze"
            color={subTextColor}
            fontSize="sm"
            network={network}
          />

          {/*open in explorer button*/}
          {!isFrozenKnown && explorer && (
            <OpenTabIconButton
              size="sm"
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.frozenAddress}`}
            />
          )}
        </HStack>
      </PageItem>

      {/*fee*/}
      <PageItem fontSize="sm" label={t<string>('labels.fee')}>
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
      </PageItem>

      {/*completed date*/}
      {transaction.completedAt && (
        <PageItem fontSize="sm" label={t<string>('labels.date')}>
          <Text color={subTextColor} fontSize="sm">
            {new Date(transaction.completedAt).toLocaleString()}
          </Text>
        </PageItem>
      )}

      {/*note*/}
      {transaction.note && (
        <PageItem fontSize="sm" label={t<string>('labels.note')}>
          <Code
            borderRadius="md"
            color={defaultTextColor}
            fontSize="sm"
            wordBreak="break-word"
          >
            {transaction.note}
          </Code>
        </PageItem>
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
          <PageItem fontSize="sm" label={t<string>('labels.id')}>
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
          </PageItem>

          {/*group id*/}
          {transaction.groupId && (
            <PageItem fontSize="sm" label={t<string>('labels.groupId')}>
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
            </PageItem>
          )}
        </VStack>
      </MoreInformationAccordion>
    </VStack>
  );
};

export default AssetTransferTransactionContent;

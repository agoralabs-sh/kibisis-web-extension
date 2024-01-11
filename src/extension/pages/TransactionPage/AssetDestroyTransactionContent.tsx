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

// components
import AddressDisplay from '@extension/components/AddressDisplay';
import AssetDisplay from '@extension/components/AssetDisplay';
import CopyIconButton from '@extension/components/CopyIconButton';
import MoreInformationAccordion from '@extension/components/MoreInformationAccordion';
import OpenTabIconButton from '@extension/components/OpenTabIconButton';
import PageItem, { ITEM_HEIGHT } from '@extension/components/PageItem';

// constants
import { DEFAULT_GAP } from '@extension/constants';

// hooks
import useDefaultTextColor from '@extension/hooks/useDefaultTextColor';
import useSubTextColor from '@extension/hooks/useSubTextColor';

// selectors
import {
  useSelectAccounts,
  useSelectPreferredBlockExplorer,
} from '@extension/selectors';

// types
import {
  IAccount,
  IAssetDestroyTransaction,
  IExplorer,
  INetwork,
} from '@extension/types';

// utils
import createIconFromDataUri from '@extension/utils/createIconFromDataUri';
import ellipseAddress from '@extension/utils/ellipseAddress';
import isAccountKnown from '@extension/utils/isAccountKnown';

interface IProps {
  network: INetwork;
  transaction: IAssetDestroyTransaction;
}

const AssetDestroyTransactionContent: FC<IProps> = ({
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
  const explorer: IExplorer | null =
    network.explorers.find((value) => value.id === preferredExplorer?.id) ||
    network.explorers[0] ||
    null; // get the preferred explorer, if it exists in the networks, otherwise get the default one
  // handlers
  const handleMoreInformationToggle = (value: boolean) =>
    value ? onOpen() : onClose();

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
            {transaction.assetId}
          </Text>
          <CopyIconButton
            ariaLabel={t<string>('labels.copyAssetId')}
            tooltipLabel={t<string>('labels.copyAssetId')}
            size="sm"
            value={transaction.assetId}
          />
          {explorer && (
            <OpenTabIconButton
              size="sm"
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={`${explorer.baseUrl}${explorer.assetPath}/${transaction.assetId}`}
            />
          )}
        </HStack>
      </PageItem>

      {/*creator address*/}
      <PageItem fontSize="sm" label={t<string>('labels.creatorAccount')}>
        <HStack spacing={0}>
          <AddressDisplay
            address={transaction.creator}
            ariaLabel="Creator address"
            color={subTextColor}
            fontSize="sm"
            network={network}
          />

          {/*open in explorer button*/}
          {!isAccountKnown(accounts, transaction.creator) && explorer && (
            <OpenTabIconButton
              size="sm"
              tooltipLabel={t<string>('captions.openOn', {
                name: explorer.canonicalName,
              })}
              url={`${explorer.baseUrl}${explorer.accountPath}/${transaction.creator}`}
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
          icon={createIconFromDataUri(network.nativeCurrency.iconUrl, {
            color: subTextColor,
            h: 3,
            w: 3,
          })}
          prefix="-"
          unit={network.nativeCurrency.symbol}
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
                  ariaLabel={t<string>('labels.copyTransactionId')}
                  tooltipLabel={t<string>('labels.copyTransactionId')}
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
                  ariaLabel={t<string>('labels.copyGroupId')}
                  tooltipLabel={t<string>('labels.copyGroupId')}
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

export default AssetDestroyTransactionContent;
